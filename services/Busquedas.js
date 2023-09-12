import fs from 'fs';
import anxios from 'axios';

export class Busquedas {
    historial = [];
    dbPath='./db/database.json';

    constructor() {
        //TODO: Leer db si existe
        this.leerDB();
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'
        }
    }

    get paramsWeather() {
        return { 
            appid: process.env.OPEN_WEATHER_KEY,
            lang: 'es',
            units: 'metric'
        }
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(palabra => palabra[0].toUpperCase() + palabra.substring(1));
            return palabras.join(' ');
        });
    }
    async ciudad( lugar = '') {
        //console.log('Ciudad: ' + lugar);

        try {
            const instance = anxios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });
            
            const respuesta = await instance.get();
            console.log(respuesta.data);
            return respuesta.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.text,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            return [];
        }        
    }

    async climaxlugar( lat, lon) {
        try {
            const instance = anxios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
                params: { ...this.paramsWeather, lat, lon }
            });
            const respuesta = await instance.get();
            //console.log(respuesta.data);

            let datos = [];

            datos.desc = respuesta.data.weather[0].description;
            datos.min = respuesta.data.main.temp_min;
            datos.max = respuesta.data.main.temp_max;
            datos.temp = respuesta.data.main.temp;

            //console.log(datos);

            return datos;

        } catch (error) {
            console.log(error);
            return [];
        }
    }

    agregarHistorial( lugar = '') {
        if(this.historial.includes(lugar.toLowerCase)) {
            return;
        }
        this.hostorial =  this.historial.splice(5, 1)
        ;
        this.historial.unshift( lugar );
        this.guardarDB();
    }

    guardarDB() {

        const payload = {
            hostorial: this.historial
        };

        fs.writeFileSync( this.dbPath, JSON.stringify(payload));
    }

    leerDB() {
        if( !fs.existsSync(this.dbPath)) {
            return null;
        }
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
    
        const data = JSON.parse( info );

        this.historial = data.hostorial;
    }
}