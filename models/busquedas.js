const fs = require('fs');

const axios = require('axios');

class Busquedas{

    constructor(){
        //conexión con base de datos
        this.historial = [];
        this.dbPath = './db/database.json';
        this.leerDB();        
    }

    get paramsMapBox(){
        return{
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5, 
            'language':'es'
        }
    }

    get historialCapitalizado(){
        return this.historial.map(lugar =>{
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));            
            return palabras.join(' ');
        });
    }

    async ciudad(lugar = ''){
        //se usa el async para las peticiones 
        //console.log(lugar);
        const intance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`, 
            params: this.paramsMapBox             
        });

        try{
            const respuesta = await intance.get();
            return respuesta.data.features.map(lugar =>({
                id: lugar.id, 
                name: lugar.place_name, 
                lng: lugar.center[0], 
                lat: lugar.center[1]
            }));
            
        }catch(error){
            return []
        }
       
    }

    get paramsWheatherPlace(){
        return{            
            appid: process.env.OPENWHEATHER_KEY, 
            units: 'metric', 
            lang: 'es',         
        }
    }

    async climaLugar(lon = '', lat = ''){
        try{
                const instance = axios.create({
                    baseURL: 'https://api.openweathermap.org/data/2.5/weather', 
                    params: {...this.paramsWheatherPlace, lon, lat}
            })

            const respuesta = await instance.get(); 
            //console.log(respuesta.data)     
            const {weather, main} = respuesta.data;
            
            return{
                des: weather[0].description,  
                temp: main.temp,
                temp_min: main.temp_min,
                temp_max: main.temp_max                             
            }
            
        }catch(error){
            console.log(error);
        }
    }

    agregarhistorial(lugar = ''){

        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial = this.historial.splice(0,5);
        //Todo prevenir duplicados
        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarDB();
    }

    guardarDB(){
        if(!fs.existsSync(this.dbPath)) return;
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'}); 
        const data = JSON.parse(info); 
        this.historial = data.historial;
        console.log(this.historial); 
    }
}

module.exports = Busquedas;