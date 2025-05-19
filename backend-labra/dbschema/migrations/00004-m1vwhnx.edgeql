CREATE MIGRATION m1vwhnxi77pasqypgtzfucywp6vywjxekhqmw3bpozif5m2nypczuq
    ONTO m16to3mpxnacx6aqrpwiuiqr22prgdej2bd3lfc3vcitchjclj3fpa
{
  ALTER TYPE default::Task {
      CREATE REQUIRED PROPERTY completed: std::bool {
          SET default := false;
      };
  };
};
