const db = require("../models/index");
const validator = require("../utils/validateCredentials");

const addRole = async (req, res) => {
  try {
    const { name, description} =  req.body;
    if(!name ||  !description){
      return res.status(400).json({message: "Missing fields"});
    }
    const data = await db.role.create(req.body);

    res.status(201).json({
      statusCode: 201,
      responseCode: "CREATED",
      message: "New role added successfully",
      data: data,
    });
  } catch (error) {
    // console.error(error);
    res.status(400).json(validator.validate(error));
  }
};

const delRole = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      // Handle the case where req.params.id is not a valid number
      // For example, you could send a 400 Bad Request response
      res.status(400).send('Invalid ID parameter');
      return;
    }

    const data = await db.role.destroy({
      where: {
        id: id,
      },
    });
    if (data === 1) {
      res.status(200).json({
        statusCode: 200,
        responseCode: "DELETED",
        message: `Deleted role with id ${id}`,
      });
    } else {
      throw new Error(`No role available with id ${id}`);
    }
  } catch (error) {
    // console.error(error);
    res.status(400).json({
      statusCode: 400,
      responseCode: "Unable to delete role.",
      message: error.message,
    });
  }
};

const getAllRoles = async (req, res) => {
  try {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = (page - 1) * limit;
    const count = await db.role.count();
    const data = await db.role.findAll({
      limit: limit,
      offset: offset,
    });
    if (!data || data.length <= 0) {
      throw new Error("unable to fetch roles from server");
    }
    res.status(200).json({
      statusCode: 302,
      responseCode: "success",
      message: "Retrieved all Roles",
      data: data,
      pagination:{
        totalItems: count,
        totalpage:Math.ceil(count/limit),
        currentPage: page,
        nextPage: Math.min(page + 1, Math.ceil(count / limit)),
        previousPage: Math.max(1, page - 1),
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      statusCode: 500,
      responseCode: "server error",
      message: error.message,
    });
  }
};

const getSpecificRole = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    // Handle the case where req.params.id is not a valid number
    // For example, you could send a 400 Bad Request response
    res.status(400).send('Invalid ID parameter');
    return;
  }
  try {
    const data = await db.role.findOne({ where: { id: id } });

    if (!data) {
      throw new Error(`No record found for the id ${id}`);
    }
    res.status(302).json({
      statusCode: 302,
      responseCode: "SUCCESSFUL",
      message: "Role Retrieved Successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 404,
      responseCode: "NOT FOUND",
      message: error.message,
    });
  }
};

const updateRole = async (req, res) => {
  let id = Number(req.params.id);
  if (isNaN(id)) {
    // Handle the case where req.params.id is not a valid number
    // For example, you could send a 400 Bad Request response
    res.status(400).send('Invalid ID parameter');
    return;
  }
  try {
    const data = await db.role.update(
      { ...req.body },
      {
        where: { id: id },
      }
    );
    // console.log(data[0]);
    if (data[0] === 1) {
      res.status(200).json({
        statusCode: 200,
        responseCode: "Role Updated Successfully",
        message: "Role has been updated successfully",
      });
    } else {
      throw new Error(
        `Unable to update role as no role is present with id ${id}`
      );
    }
  } catch (error) {
    // console.log(error);
    res.status(400).json(validator.validate(error));
  }
};

module.exports = {
  addRole,
  delRole,
  getAllRoles,
  getSpecificRole,
  updateRole,
};
