const connDB = require('./connection');

class EventModel {
  constructor(req){
    this.req = req
  };

  getEvents(){
    return "SELECT * FROM events ORDER BY start_date DESC";
  };

  getEvent(){
    return `SELECT * FROM events WHERE id = ${this.req.params.id};`;
  }

  postEvent(){
    const { body } = this.req;
    let query = "INSERT INTO `events` (name, start_date, end_date, description, location) VALUES (";
        query += `'${body.name}',`;
        query += ` DATE_FORMAT('${body.start_date}', '%Y-%m-%d %H:%i:%s'),`;
        query += ` DATE_FORMAT('${body.end_date}', '%Y-%m-%d %H:%i:%s'),`;
        query += ` '${body.description.trim()}',`;
        query += ` '${body.location.trim()}');`

    return query;
  };

  patchEvent(){
    const { body, params } = this.req;
    let query = "UPDATE `events` SET";
        query += ` name = '${body.name}',`;
        query += ` start_date = DATE_FORMAT('${body.start_date}', '%Y-%m-%d %H:%i:%s'),`;
        query += ` end_date = DATE_FORMAT('${body.end_date}', '%Y-%m-%d %H:%i:%s'),`;
        query += ` description = '${body.description.trim()}',`;
        query += ` location = '${body.location.trim()}'`
        query += ` WHERE id = ${params.id};`

    return query;
  }

  deleteEvent(){
    const { params } = this.req;
    return `DELETE FROM events WHERE id = ${params.id};`;
  }
};

module.exports = EventModel;
