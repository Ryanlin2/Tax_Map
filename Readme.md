# Tax Map
Have you ever wanted to browse tax rates by location? Well there isn't a central place to just explore tax rates location by location. You would just find yourself googling 5 queries to figure out the total tax from Federal, State, County, and City. 
That is where Tax Map comes in! 

![image](https://github.com/user-attachments/assets/680e8288-248a-4b0c-916a-c36e2f62df4e)


The first iteration of this project is to offer an interactive map that displays the state income tax rate of single filers. On hover it will display the tax rates of the state. 

## Technologies Utilized
![image](https://github.com/user-attachments/assets/196d894f-5847-450b-9911-6fefc4b72686)

`Node.js` as the runtime environment, `React.js` with `Leaflet` for the frontend UI, and a `Flask` backend server to serve state tax data from a CSV. The dataset I used was from Tax Foundation Organization [https://taxfoundation.org/data/all/state/state-income-tax-rates/].

## Problems Solved during development

The dataset was HORENDOUS. ![image](https://github.com/user-attachments/assets/76f85e60-e084-49ba-bb4b-04a9eb2c5d5c)

The columns were used in an unintuitive way ( unlabeled , poorly named entries, etc). However, I did see that all the information was there.

First, I made a dictionary mapping state name to name used in dataset. (manually)
![image](https://github.com/user-attachments/assets/a4c02187-9d42-410a-b03b-30e1836edc78)


Then in Flask I created Queries to cache the wanted information, which was basically , a json of all the single filer state tax rates with the thresholds.

![image](https://github.com/user-attachments/assets/d1f00fc9-d724-4917-9c6d-22cdedc63355)

![image](https://github.com/user-attachments/assets/b416ef17-7074-4ff9-9267-e2607fbb235c) ![image](https://github.com/user-attachments/assets/8ee43aac-d599-4ecf-a603-20144c05a97f)


