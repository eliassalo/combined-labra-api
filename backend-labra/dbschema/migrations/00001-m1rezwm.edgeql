CREATE MIGRATION m1rezwmpe2houptaow6zxtll45use4k5k7yxoo3y25mdr7qpzyu6oq
    ONTO initial
{
  CREATE FUTURE simple_scoping;
  CREATE TYPE default::Project {
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
};
