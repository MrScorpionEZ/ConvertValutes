const express = require("express");
const requestApi = require("request");

const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("view options", {layout: "layout"});

app.get("/", (request, response) => {
    const url = "https://www.cbr-xml-daily.ru/daily_json.js";

    requestApi(url, (error, request2, data) =>{
        let model = {
            Valute: {}
        };

        if (error) console.log(error);
        else{
            model = JSON.parse(data);

            model.Valute["RUS"] = {
                ID: "R0",
                NumCode: "0",
                CharCode: "RUS",
                Nominal: 1,
                Name: "Российский рубль",
                Value: 1,
                Previous: 1
            };

            var order = 1;

            for (const key in model.Valute) {
                const element = model.Valute[key];
                element.order = order;
                    
                element.Value = (element.Value / element.Nominal).toFixed(3);
                element.DelValue = (1 / element.Value).toFixed(3);
                order = order + 1;
            }
        }

        response.render("main", model);
    });
});

app.get("/*", (request, response) => {
    response.redirect("/");
});

app.listen(port, () => {
    console.log(`App is running http://localhost:${port}`);
});