-- drop table sa3_table;
-- drop table shipment_table;

CREATE TABLE "sa3_table" (
	"sa3" INT,
	"sa3name" VARCHAR(100),
	"coorinates" double precision[],
	"location_URI" VARCHAR(500),
	"type" VARCHAR(50),
	PRIMARY KEY (sa3)
);


CREATE TABLE "shipment_table" (
	id SERIAL PRIMARY KEY
	,"smpPlantID" VARCHAR(10)
	,"smlCreatedDate" date
	,"smlShipmentID" INT
	,"smlShipmentLineID" INT
	,"smlPartID" INT
	,"smlDescription" VARCHAR(50)
	,"smlPartRevisionID" VARCHAR(20)
	,"smpCustomerOrganizationID" VARCHAR(20)
	,"smpShipDate" date
	,"smpShipOrganizationID" VARCHAR(20)
	,"impPartGroupID" VARCHAR(20)
	,"cmlOrganizationID" VARCHAR(20)
	,"cmlName" VARCHAR(100)
	,"cmlAddressLine1" VARCHAR(100)
	,"cmlCity" VARCHAR(50)
	,"cmlState" VARCHAR(20)
	,"quantityShipped" FLOAT
	,"ShipPeriod" VARCHAR(20)
	,"ShipYear" VARCHAR(20)
	,"ShipMonth" VARCHAR(20)
	,"postcode" INT
	,"lat" FLOAT
	,"long" FLOAT
	,"sa3" Int
	,"sa3name" VARCHAR(100)
);

SELECT * FROM SA3_table;
SELECT * FROM shipment_table;
