CREATE MIGRATION m16to3mpxnacx6aqrpwiuiqr22prgdej2bd3lfc3vcitchjclj3fpa
    ONTO m1fqastebtsfpzrjesno6ueg36cn7sahraohxu2u3k6ky6ocx3hhla
{
  ALTER TYPE default::Task {
      ALTER PROPERTY name {
          DROP CONSTRAINT std::exclusive;
      };
  };
};
