import bcrypt from 'bcrypt';
import db from './config/db.js'; 
const updatePasswords = async () => {
  db.query("SELECT id, password FROM users", async (err, results) => {
    if (err) {
      //console.error("Error fetching users:", err);
      return;
    }
    for (const user of results) {
      // Check if the password is already hashed (bcrypt hashes usually start with "$2b$")
      if (user.password.startsWith("$2b$")) continue;

      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // Update the user's password in the database
        db.query(
          "UPDATE users SET password = ? WHERE id = ?",
          [hashedPassword, user.id],
          (updateErr) => {
            if (updateErr) {
              //console.error(`Error updating user ${user.id}:`, updateErr);
            } else {
              console.log(`User ${user.id} password updated.`);
            }
          }
        );
      } catch (hashError) {
        //console.error(`Error hashing password for user ${user.id}:`, hashError);
      }
    }
  });
};

updatePasswords();
