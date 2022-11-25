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
Postcodes = Base.classes.australian_postcodes
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



# //--------------------------- API - SA3 data ---------------------------//

# Create a route that queries precipiation levels and dates and returns a dictionary using date as key and precipation as value
@app.route("/api/sa3")
def sa3():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    # Create new variable to store results from query to Measurement table for prcp and date columns
    sa3_data = session.query(SA3_table.sa3).all()

    # Close session
    session.close()
    
    # Create a dictionary from the row data and append to a list of tobs_12_months
    sa3_values = []
    for row in sa3_data:
        sa3_dict = {}
        sa3_dict["SA3_ID"] = row[0]
        sa3_values.append(sa3_dict)

    return jsonify(sa3_values) 
# //----------------------------//



# //--------------------------- API - Site list ---------------------------//

@app.route("/test")
def test():

    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Create new variable to store results of unique site names
    site_list = session.query(Shipments.smpPlantID).order_by(Shipments.smpPlantID)\
                            .distinct()

    # Create new variable to store results of unique product types
    products = session.query(Shipments.impPartGroupID).order_by(Shipments.impPartGroupID)\
                            .distinct()

    # Create new variable to store results
    main = {}
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


            period_data = session.query(Shipments.ShipPeriod, func.sum(Shipments.quantityShipped)).\
                filter(Shipments.smpPlantID == site[0]).\
                filter(Shipments.impPartGroupID == product[0]).\
                group_by(Shipments.ShipPeriod).\
                order_by(func.sum(Shipments.quantityShipped).desc()).all()

            for item in period_data:
                periods.append(item[0])
                values.append(item[1])

            products_dict["Product"] = product[0]
            products_dict["Period"] = periods
            products_dict["Values"] = values
            data.append(products_dict)



        sites["site"] = site[0]
        sites["Data"] = data

        bar.append(sites)
    main["Bar"] = bar


    return jsonify(main)
    # return f"{test}"

# //----------------------------//

# //--------------------------- Main API ---------------------------//

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



    return jsonify(main)
# //----------------------------//

#################################################
# Run App
#################################################

if __name__ == '__main__':
    app.run(debug=True)
