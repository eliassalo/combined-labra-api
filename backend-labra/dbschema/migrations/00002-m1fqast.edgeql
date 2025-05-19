CREATE MIGRATION m1fqastebtsfpzrjesno6ueg36cn7sahraohxu2u3k6ky6ocx3hhla
    ONTO m1rezwmpe2houptaow6zxtll45use4k5k7yxoo3y25mdr7qpzyu6oq
{
  CREATE TYPE default::Task {
      CREATE REQUIRED LINK project: default::Project;
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_of_statement());
      };
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY updatedAt: std::datetime {
          SET default := (std::datetime_of_statement());
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
  };
  ALTER TYPE default::Project {
      CREATE MULTI LINK tasks := (.<project[IS default::Task]);
  };
};
