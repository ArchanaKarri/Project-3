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

# Create connection to Hawaii.sqlite file
#################################################

# engine = create_engine("sqlite:///Users/udeshinpereira/Desktop/sqlalchemy-challenge/hawaii.sqlite")
# engine = create_engine("sqlite:///Resources/hawaii.sqlite")
rds_connection_string = f'{config.protocol}://{config.username}:{config.password}@{config.host}:{config.port}/{config.database_name}'
engine = create_engine(rds_connection_string)

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# #Save references to the measurement and station tables in the database
SA3_table = Base.classes.sa3_table
Postcodes = Base.classes.australian_postcodes
Shipments = Base.classes.shipment_table

#################################################
app = Flask(__name__)

# Create Flask Routes 

# Create root route
@app.route("/")
def home():
    return render_template("index.html")


# Create a route that queries precipiation levels and dates and returns a dictionary using date as key and precipation as value
@app.route("/api/sa3")
def precipitation():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of precipitation (prcp)and date (date) data"""
    
    # Create new variable to store results from query to Measurement table for prcp and date columns
    sa3_data = session.query(SA3_table.sa3).all()

    # Close session
    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
        # 1. Create an empty list of precipitation query values 
        # 2. Create for loop to iterate through query results (precipitation_query_results) 
        # 3. Create dictionary with key "precipitation" set to prcp from precipitation_query_results and key "date" to date from precipitation_query_results
        # 4. Append values from precipitation_dict to your original empty list precipitation_query_values 
        # 5. Return JSON format of your new list that now contains the dictionary of prcp and date values to your browser
    
    sa3_values = []
    for row in sa3_data:
        sa3_dict = {}
        sa3_dict["SA3_ID"] = row[0]
        sa3_values.append(sa3_dict)

    return jsonify(sa3_values) 


@app.route("/api/sites")
def site():

    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Create new variable to store results from query to Measurement table for prcp and date columns
    site_list = session.query(Shipments.smpPlantID).distinct()

    sites = []
    for row in site_list:
        site_dict = {}
        site_dict["Site"] = row[0]
        sites.append(site_dict)

    return jsonify(sites)

   
if __name__ == '__main__':
    app.run(debug=True)
