module.exports = {
  createTable (path) {
    const sqlite = require('sqlite3').verbose();
    const db = new sqlite.Database(path);
    let sql = 'CREATE TABLE IF NOT EXISTS TaskTable(\
      idTaskTable INTEGER PRIMARY KEY AUTOINCREMENT,\
      Title VARCHAR(250) NOT NULL,\
      Done INTEGER NOT NULL DEFAULT 0)'
    db.run(sql, [], (err) => {
      if(err) console.log(err);
    })
  },

  selectTasks (path) {  
    const sqlite = require('sqlite3').verbose();
    const db = new sqlite.Database(path);
    return new Promise ((resolve, reject) => {
      db.all("SELECT * FROM TaskTable",[], (err, rows) => {
        return err ? resolve(err) : resolve(rows);
      }); 
    }); 
  },

  addTask (theTask, path) {
    const sqlite = require('sqlite3').verbose();
    const db = new sqlite.Database(path);
    return new Promise ((resolve, reject) => {
      db.serialize(() => {
        db.run("INSERT INTO TaskTable (Title) VALUES (?)", [theTask], (err) => {
          if (err) console.log(err);
        })
        .all("SELECT * FROM TaskTable", [], (err, rows) => {
          return err ? resolve(err) : resolve(rows);
        })
      })
    }) 
    
  },

  taskDone (id, path) {
    const sqlite = require('sqlite3').verbose();
    const db = new sqlite.Database(path);
    return new Promise ((resolve, reject) => {
      db.serialize(() => {
        db.run("UPDATE TaskTable SET DONE = 1 WHERE idTaskTable = ?", [id], (err) => {
          if(err) console.log(err);
        })
        .all("SELECT * FROM TaskTable", [], (err, rows) => {
          return err ? resolve(err) : resolve(rows);
        })
      })
    }) 
    
  },

  taskUndone (id, path) {
    const sqlite = require('sqlite3').verbose();
    const db = new sqlite.Database(path);
    return new Promise ((resolve, reject) => {
      db.serialize(() => {
        db.run("UPDATE TaskTable SET DONE = 0 WHERE idTaskTable = ?", [id], (err) => {
          if(err) console.log(err);
        })
        .all("SELECT * FROM TaskTable", [], (err, rows) => {
          return err ? resolve(err) : resolve(rows);
        })
      })
    }) 
    
  },

  updateTask (task, id, path) {
    const sqlite = require('sqlite3').verbose();
    const db = new sqlite.Database(path);
    let sql = "UPDATE TaskTable SET Title = ? WHERE idTaskTable = ?";
    return new Promise ((resolve, reject) => {
      db.serialize(() => {
        db.run(sql, [task, id], (err) => {
          if(err) console.log(err);
        })
        .all("SELECT * FROM TaskTable", [], (err, rows) => {
          return err ? resolve(err) : resolve(rows);
        })
      })
    }) 
  },

  selectTaskById (id, path) {
    const sqlite = require('sqlite3').verbose();
    const db = new sqlite.Database(path);  
    let sql  = "SELECT * FROM TaskTable WHERE idTaskTable = ?";
  
    return new Promise ((resolve, reject) => {
      db.all(sql,[id], (err, rows) => {
        return err ? resolve(false) : resolve(rows);
      }); 
    });  
  },

  deleteTask (id, path) {
    const sqlite = require('sqlite3').verbose();
    const db = new sqlite.Database(path);
    return new Promise ((resolve, reject) => {
      db.serialize(() => {
        db.run("DELETE FROM TaskTable WHERE idTaskTable = ?", [id], (err) => {
          if(err) console.log(err);
        })
        .all("SELECT * FROM TaskTable", [], (err, rows) => {
          return err ? resolve(err) : resolve(rows);
        })
      })
    }) 
    
  },

  deleteAll (path) {
    const sqlite = require('sqlite3').verbose();
    const db = new sqlite.Database(path);
    return new Promise ((resolve, reject) => {
      db.serialize(() => {
        db.run("DELETE FROM TaskTable WHERE Done = 1", [], (err) => {
          if(err) console.log(err);
        })
        .all("SELECT * FROM TaskTable", [], (err, rows) => {
          return err ? resolve(err) : resolve(rows);
        })
      })
    }) 
    
  }

}
