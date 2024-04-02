const db = require("../models/index");
const validator = require("../utils/validateCredentials");
const { Op } = require("sequelize");
const { sendRegistrationEmail} = require("../Mails/nodeMailer");


const registerDoctor = async (req, res) => {
  try {
    const doctor = await db.doctor_details.create(req.body);

    if (!doctor) {
      res.status(401).json({ message: "plese fill all mandatory  fields" });
      return;
    } else {
      sendRegistrationEmail(doctor.name,doctor.email);

      res.status(200).json({
        statusCode: 200,
        responseCode: "success",
        message: "Successfully added new Doctor!",
        data: doctor,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(validator.validate(error));
  }
};

const removeDoctor = async (req, res) => {
  let id = Number(req.params.id);
  if (isNaN(id)) {
    // Handle the case where req.params.id is not a valid number
    // For example, you could send a 400 Bad Request response
    res.status(400).send('Invalid ID parameter');
    return;
  }
  try {
    const result = await db.doctor_details.destroy({
      where: {
        id: id,
      },
      returning: true,
    });

    if (result === 1) {
      res.status(200).json({
        statusCode: 200,
        responseCode: "SUCCESS",
        message: `Deactivated Doctor with ID ${id}`,
      });
    } else {
      throw new Error(`No Doctor found with ID ${id}`);
    }
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      responseCode: "FAILURE",
      message: error.message || `Failed to Deactivate doctor with ID ${id}`,
    });
  }
};

const findDoctorById = async (req, res) => {
  // console.log(typeof req.params.id);
  let id = Number(req.params.id);
  if (isNaN(id)) {
    // Handle the case where req.params.id is not a valid number
    // For example, you could send a 400 Bad Request response
    res.status(400).send('Invalid ID parameter');
    return;
  }

  try {
    const doctor = await db.doctor_details.findOne({
      where: {
        id: id,
      },
      include: [db.medical_practice,db.doctors_prefered_locations],
    });
    if (!doctor) {
      throw new Error(`No  Doctor Found With Id ${id} `);
    }

    res.status(200).json({
      statusCode: 302,
      responseCode: "SUCCESS",
      message: "Successfully Retrieved Data",
      data: doctor,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      responseCode: "ERROR",
      message: error.message || "Error In Fetching Data",
    });
  }
};

const findAllDoctors = async (req, res) => {
  try {
    // console.log("hello i am here");
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = (page - 1) * limit;
    const count = await db.doctor_details.count();
    let doctors = await db.doctor_details.findAll({
      limit: limit,
      offset: offset,
      include: [db.medical_practice, db.doctors_prefered_locations],
    });
    if (!doctors || doctors.length === 0) throw new Error("No Doctors Found!");

    res.status(200).json({
      statusCode: 302,
      responseCode: "SUCCESS",
      message: "Doctors Retrieved Successfully!",
      data: doctors,
      pagination:{
        totalItems: count,
        totalpage:Math.ceil(count/limit),
        currentPage: page,
        nextPage: Math.min(page + 1, Math.ceil(count / limit)),
        previousPage: Math.max(1, page - 1),
        limit:limit
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      statusCode: 500,
      responseCode: "SERVER_ERROR",
      message: err.message || "Error Occured!",
    });
  }
};

const updateDoctor = async (req, res) => {
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      // Handle the case where req.params.id is not a valid number
      // For example, you could send a 400 Bad Request response
      res.status(400).send('Invalid ID parameter');
      return;
    }

    let doctor = await db.doctor_details.update(req.body, {
      where: { id: id },
    });
    if (doctor[0] === 1) {
      return res.status(200).json({ message: "Doctor updated sucessfully" });
    } else {
      return res
        .status(404)
        .json({ message: "no data available for update user" });
    }
  } catch (e) {
    res.status(400).json(validator.validate(e));
  }
};

const addDoctorsPreferedLocations = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    // Handle the case where req.params.id is not a valid number
    // For example, you could send a 400 Bad Request response
    res.status(400).send('Invalid ID parameter');
    return;
  }
  let result = [];
  const { city, state } = req.body;
  if(Object.keys(req.body).length == 0){
    return res
      .status(404)
      .json({ error: "Please provide at least one preferred city and state" });
  }
  if (city[0] == "" && state[0] == "") {
    return res
      .status(404)
      .json({ error: "Please provide at least one preferred city and state" });
  }
  try {
    let locations = [];
    for (let i = 0; i < city.length; i++) {
      locations.push({ city: city[i], state: state[i] });
    }

    for (const location of locations) {
      let preferedLocations = await db.doctors_prefered_locations.findOrCreate({
        where: {
          doctor_id: id,
          city: location.city,
          state: location.state,
        },
        defaults: {
          doctor_id: id,
          city: location.city,
          state: location.state,
        },
      });
      result.push(preferedLocations[0].dataValues);
    }

    let del = await db.doctors_prefered_locations.destroy({
      where: {
        doctor_id: id,
        city: {
          [Op.notIn]: city,
        },
      },
    });

    if (result.length < 1) {
      throw new Error("No data to update");
    } else {
      res.status(201).json({
        statusCode: 201,
        responseCode: "success",
        message: "prefered locations added successfully",
        data: result,
      });
    }
  } catch (error) {
    // console.error(error);
    res.status(400).json({
      statusCode: 400,
      responseCode: "failed",
      message: error.message,
    });
  }
};

const getDoctorsByUserPreference = async(req,res)=>{
  const { medPracId, city, state} = req.params;  
  const id = Number(medPracId);
  if (isNaN(id)) {
    // Handle the case where req.params.id is not a valid number
    // For example, you could send a 400 Bad Request response
    res.status(400).send('Invalid ID parameter');
    return;
  }

  const doctors = await db.doctor_details.findAll({
    include:[
      {
        model:db.medical_practice,
        where:{
          id:id
        }
      },
      {
        model:db.doctors_prefered_locations,
        where:{
          city:city,
          state:state
        }
      }
    ],
  });
  res.json(doctors);

    
}

module.exports = {
  registerDoctor,
  removeDoctor,
  findDoctorById,
  findAllDoctors,
  updateDoctor,
  addDoctorsPreferedLocations,
  getDoctorsByUserPreference
};
