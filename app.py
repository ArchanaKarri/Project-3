#################################################
# Import all dependencies: 
################################################# 

import numpy as np
import config
import sqlalchemy
import datetime as dt
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, redirect,url_for,render_template

#################################################
# Database Setup
##################################################

rds_connection_string = f'{config.protocol}://{config.username}:{config.password}@{config.host}:{config.port}/{config.database_name}'
engine = create_engine(rds_connection_string)

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to the sa3_table, shipment_table and australian_postcodes tables in the database
SA3_table = Base.classes.sa3_table
Shipments = Base.classes.shipment_table

#################################################
# Flask Setup
#################################################

app = Flask(__name__)


#################################################
# Flask Routes
#################################################

# //--------------------------- Create home route ---------------------------//
@app.route("/")
def home():
    return render_template("index.html")
# //----------------------------//



# //--------------------------- API - Map data ---------------------------//

# Create a route that queries precipiation levels and dates and returns a dictionary using date as key and precipation as value
@app.route("/map/<site>")
def map(site):
    # Create our session (link) from Python to the DB
    session = Session(engine)



    # Create empty dicts and array
    sites_dict = {}
    data = {}
    featurelist = []
        
        

        # Create new variable to store results of data that is filtered to only display the itterations site name
        # Data is also grouped by sa3 id
    total_by_location = session.query(Shipments.sa3, func.sum(Shipments.quantityShipped)).\
                filter(Shipments.smpPlantID == site).\
                group_by(Shipments.sa3).\
                order_by(func.sum(Shipments.quantityShipped).desc()).all()
        

    # Add to data dict
    data["type"] = "FeatureCollection"

    # Loop through location data
    for location in total_by_location:

            # Create empty dicts to hold features and one to contain other variables
            featuredict = {}
            container = {}

            # Add feature to the features dict
            featuredict["type"] = "Feature"

            # Create new variable to store results of location specific results
            location_data = session.query(SA3_table.coorinates, SA3_table.type).\
                filter(SA3_table.sa3 == location[0]).all()

            # loop though each result and add coords and type to featuredict
            for x in location_data:
                featuredict["geometry"] = {"type": x[1], "coordinates": [x[0]]}


            # Create new variable to store totals by product type
            products_by_location = session.query(Shipments.impPartGroupID, func.sum(Shipments.quantityShipped)).\
                        filter(Shipments.smpPlantID == site).\
                        filter(Shipments.sa3 == location[0]).\
                        group_by(Shipments.impPartGroupID).\
                        order_by(func.sum(Shipments.quantityShipped).desc()).all()

            # Close session
            session.close()

            # Create empty list
            product_qty_list = []

            # Loop through each product in the results, for each result create a dict and append the product_qty_list
            for item in products_by_location:
                product_qty_dict = {}
                product_qty_dict["product"] = item[0]
                product_qty_dict["value"] = item[1]
                product_qty_list.append(product_qty_dict)

            
            # using the results from before append or add to lists to dicts
            container["total"] = location[1]
            container["byproduct"] = product_qty_list
            featuredict["id"] = location[0]
            featurelist.append(featuredict)
            featuredict["properties"] = container

    # using the results from before append or add to lists to dicts
    data["features"] = featurelist
    sites_dict["data"] = data

    return jsonify(data)
# //----------------------------//


# //--------------------------- API - Main data ---------------------------//

# Create a route that summaises shipment table to run tables in JS file
@app.route("/main/")
def main():

    # Create our session (link) from Python to the DB
    session = Session(engine)


# //------------ Site list ------------ 
    # Create new variable to store results of unique site names
    site_list = session.query(Shipments.smpPlantID).order_by(Shipments.smpPlantID)\
                            .distinct()

    # Create new variable to store results
    main = {}
    site = []

    # Loop through results and add values to a list
    for row in site_list:
        item = row[0]
        site.append(item)

    # add Dictionary item to the main variable
    main["Sites"] = site


# //------------ Pie data ------------ 

    # Create new variable to store results
    pie = []

    # Loop through each site in the site list
    for row in site_list:
        sites = {}
        products = []
        units = []

        # Create new variable to store results of data that is filtered to only display the itterations site name
        # Data is also grouped by part type
        data = session.query(Shipments.impPartGroupID, func.sum(Shipments.quantityShipped)).\
                filter(Shipments.smpPlantID == row[0]).\
                group_by(Shipments.impPartGroupID).\
                order_by(func.sum(Shipments.quantityShipped).desc()).all()

        # Loop through each product and append values into a list
        for item in data:
            products.append(item[0])
            units.append(item[1])
    
        # add list item to the variables
        sites["Products"] = products
        sites["units"] = units
        sites["site"] = row[0]
        
        # add Dictionary item to the pie variable
        pie.append(sites)

    # add Dictionary item to the main variable
    main["Pie"] = pie


# //------------ Bar data ------------ 

    # Create new variable to store results of unique product types
    products = session.query(Shipments.impPartGroupID).order_by(Shipments.impPartGroupID)\
                            .distinct()

    # Create new variable to store results
    bar = []

    # Loop through each site in the site list
    for site in site_list:
        sites = {}
        
        data = []

        # Loop through each product in the site list
        for product in products:
            products_dict = {}
            periods = []
            values = []

            # Create new variable to store results of data that is filtered to only display the itterations site name and product
            # Data is also grouped by Shipped period
            period_data = session.query(Shipments.ShipPeriod, func.sum(Shipments.quantityShipped)).\
                filter(Shipments.smpPlantID == site[0]).\
                filter(Shipments.impPartGroupID == product[0]).\
                group_by(Shipments.ShipPeriod).\
                order_by(func.sum(Shipments.quantityShipped).desc()).all()

            # Loop through each period and append values into a list
            for item in period_data:
                periods.append(item[0])
                values.append(item[1])

            # add list item to the variables
            products_dict["Product"] = product[0]
            products_dict["Period"] = periods
            products_dict["Values"] = values
            data.append(products_dict)


        # add list item to the variables
        sites["site"] = site[0]
        sites["Data"] = data


        # add Dictionary item to the bar variable
        bar.append(sites)
    
    # add Dictionary item to the main variable
    main["Bar"] = bar

# //------------ Summary data ------------ 

    summary_list = []

    # Loop through each site in the site list
    for site in site_list:
        sites = {}

        # Create new variable to store results of data that is filtered to only display the itterations site name
        # and top sold product and volume
        product_data = session.query(Shipments.impPartGroupID, func.sum(Shipments.quantityShipped)).\
                filter(Shipments.smpPlantID == site[0]).\
                group_by(Shipments.impPartGroupID).\
                order_by(func.sum(Shipments.quantityShipped).desc()).limit(1).all()

        # loop through result add top product type and volume to dict
        for product_type in product_data:
            sites["type_product"] = product_type[0]
            sites["type_volume"] = product_type[1]

        # add site id to the dict
        sites["site"] = site[0]
        
        # Create new variable to store results of data that is filtered to only display the itterations site name
        # and top sold part id and volume
        part_data = session.query(Shipments.smlPartID, func.sum(Shipments.quantityShipped)).\
                filter(Shipments.smpPlantID == site[0]).\
                group_by(Shipments.smlPartID).\
                order_by(func.sum(Shipments.quantityShipped).desc()).limit(1).all()

        # loop through result add item to the variables
        for part in part_data:
            sites["product_volume"] = part[1]
        
            # Create new variable to store results of data that is filtered to only display the itterations site name
            # and top sold part description
            part_description = session.query(Shipments.smlDescription).\
                        filter(Shipments.smpPlantID == site[0]).\
                        filter(Shipments.smlPartID == part[0]).limit(1).all()

            # loop through result add item to the variables
            for part_desc in part_description:
                sites["product_name"] = part_desc[0]


        # add Dictionary item to the summary variable
        summary_list.append(sites)

    # add Dictionary item to the main variable
    main["summary"] = summary_list


   # Close session
    session.close()

    return jsonify(main)

 
# //----------------------------//

#################################################
# Run App
#################################################

if __name__ == '__main__':
    app.run(debug=True)
