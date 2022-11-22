drop table sa3_table;
drop table australian_postcodes;
drop table shipment_table;

CREATE TABLE "sa3_table" (
	"sa3" INT,
	"sa3name" VARCHAR(100),
	"location_URI" VARCHAR(500),
	PRIMARY KEY (sa3)
);

CREATE TABLE "australian_postcodes" (
	"postcode" INT,
	"lat" FLOAT,
	"long" FLOAT,
	"sa3" Int,
	"sa3name" VARCHAR(100),
	PRIMARY KEY (postcode)
);

CREATE TABLE "shipment_table" (
	"smpPlantID" VARCHAR(10)
	,"smlCreatedDate" VARCHAR(100)
	,"smlShipmentID" INT
	,"smlShipmentLineID" INT
	,"smlPartID" INT
	,"smlDescription" VARCHAR(50)
	,"smlPartRevisionID" VARCHAR(20)
	,"smpCustomerOrganizationID" VARCHAR(20)
	,"smpShipDate" VARCHAR(100)
	,"smpShipOrganizationID" VARCHAR(20)
	,"impPartGroupID" VARCHAR(20)
	,"cmlOrganizationID" VARCHAR(20)
	,"cmlName" VARCHAR(100)
	,"cmlAddressLine1" VARCHAR(100)
	,"cmlCity" VARCHAR(50)
	,"cmlState" VARCHAR(20)
	,"cmlPostCode" INT
	,"quantityShipped" FLOAT
);

SELECT * FROM SA3_table;
SELECT * FROM australian_postcodes;
SELECT * FROM shipment_table;