
<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ArchanaKarri/Project-3.git">
    <img src="images/map.webp" alt="Logo" width="150" height="100">
  </a>

<h3 align="center">Project 3</h3>

  <p align="center">
    Project 3 (We can call this something more specific)
    <br />
    <a href="https://github.com/ArchanaKarri/Project-3.git"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="ADD LINK TO PRESENTATION">View Presentation</a>
    ·
    <a href="https://github.com/ArchanaKarri/Project-3/issues">Report Bug</a>
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#why-this-topic">Why this topic?</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#push-data-to-tables">Push Data To Tables</a></li>
      </ul>
    </li>
    <li>
      <a href="#running-app">Running app.py</a>
      <ul>
        <li><a href="#installing-dependencies">Installing Dependencies</a></li>
        <li><a href="#run-app">Run app.py</a></li>
        <li><a href="#results">Results</a></li>
      </ul>
    </li>
    <li><a href="#analysis">Analysis</a></li>
    <li><a href="#creators">Creators</a></li>
    <li><a href="#citing-and-referencing">Citing and Referencing</a></li>
  </ol>
</details>



<!-- ------------- ABOUT THE PROJECT ------------- -->
## About The Project

Breif overview of the project

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ---- Why this topic? ---- -->
## Why this topic?

Sentence or two on why we chose this topic

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ------------- GETTING STARTED ------------- -->
## Getting Started

To get a local copy up and running follow these simple example steps.

<!-- ---- installation ----- -->

### Installation
 
1. Install "PostgreSQL" through this link https://www.postgresql.org/download/

2. Select your operating system.

3. Click on the "Download the installer" link

4. Download the latest version avaiable

6. Once downloaded, open the installer and follow the steps to complete the installation

5. If you need any help with the installation of PostgreSQL you can find install resoures here https://www.postgresql.org/docs/current/tutorial-install.html


#### pgAdmin

1. Clone the repo
   ```sh
   git clone https://github.com/ArchanaKarri/Project-3.git
   ```
2. Open pgAmin and create a new database called 
   ```js
   shipment
   ```
3. Right click on the shipment database and click on `Query tool`
   
4. Within the Query Tool, open and run file called `PGAdmin_table_schema.sql` located
   ```js
   Where_you_cloned_the_repo + \PGAdmin_table_schema.sql
   ```

    You now have your tables and columns created. Next we will populate these tables with data.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

<!-- ---- push-data-to-tables ---- -->
### Push data to tables

1. Create a python file called `config.py` and save it in the folder "SQL-challenge".

2. Within the config.py copy and paste the code below. 

```
protocol = 'postgresql'
username = "ENTER POSTGRES USERNAME"
password = "ENTER PASSWORD HERE"
host = 'localhost'
port = 5432     #This may be a different port number
database_name = 'shipment'  #Make sure this is the same name database name as the one you created earlier

```

3. Enter in your username and password for PG Admin.

4. Locate file called coordinates.ipynb found in folder "PROJECT-3"

5. Open coordinates.ipynb in any application that can run a Jupyter notebook.

6. Refresh and clear the kernal. Click on "Run all"

The end result will display the data that has just been read into the shipment database.


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ------------- running-app.py ------------- -->
## Running-app
To get a local copy up and running follow these simple example steps.
<br>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- -----installing-dependencies---- -->
### Installing dependencies

list of all the dependencies that will need to be installed

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- -----run-app.py---- -->
### Run app

steps to run app.py

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- -----results---- -->
### Results

A few pics on the end results

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ------------- Analysis ------------- -->
## Analysis

Enter analysis

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ------------- Creators ------------- -->
## Creators

Josh Martin - [https://github.com/joshmartin33](https://github.com/joshmartin33)<br>
Archana Karri - [https://github.com/ArchanaKarri](https://github.com/ArchanaKarri)<br>
Udeshi Pereira - [https://github.com/Shaloomi](https://github.com/Shaloomi)


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ------------- Citing and Referencing ------------- -->
## Citing and Referencing

* Database of Australian Postcodes - australian_postcodes.csv. (2022). Retrieved from [https://www.matthewproctor.com/australian_postcodes](https://www.matthewproctor.com/australian_postcodes)

* Australian Statistical Geography Standard (ASGS) Edition 3 - SA3_2021_AUST.csv. (2021). Retrieved from [https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs-edition-3/jul2021-jun2026/access-and-downloads/allocation-files](https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs-edition-3/jul2021-jun2026/access-and-downloads/allocation-files)

* Product delivery location - shipment_data_2021-2022_financial_year.csv. (2022). Retrieved from a private company. Reference can be requested direct by contacting Josh Martin https://github.com/joshmartin33.

<p align="right">(<a href="#readme-top">back to top</a>)</p>