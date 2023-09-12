import 'dotenv/config';

import { inquirerMenu, inquirerPausa, leerInput, listarLugares } from "./helpers/inquirer.js";
import { Busquedas } from './services/Busquedas.js'; 


const main = async() => {

    let opt = '';
    const busquedas = new Busquedas();

    do {
        opt = await inquirerMenu();
        switch(opt) {
            case 1:
                const textoABuscar = await leerInput('Descripción de la tarea: ');
                const lugares = await busquedas.ciudad(textoABuscar);
                console.log(lugares);
                const idSeleccionado = await listarLugares(lugares);
                if (idSeleccionado === '0') continue;
                //console.log(idSeleccionado);
                const lugarSeleccionado = lugares.find(l => l.id = idSeleccionado);
                busquedas.agregarHistorial( lugarSeleccionado.nombre );
                //console.log(lugarSeleccionado);

                const climaxciudad = await busquedas.climaxlugar(lugarSeleccionado.lat, lugarSeleccionado.lng);
                console.log('\nInformación de la ciudad\n');
                console.log('Ciudad: ' + lugarSeleccionado.nombre.green);
                console.log('Latitud: ' + lugarSeleccionado.lat);                
                console.log('Longitud: ' + lugarSeleccionado.lng);
                console.log('Como esta el clima: ' + climaxciudad.desc.green);
                console.log('Temperatura: ' + climaxciudad.temp);
                console.log('Mínima: ' + climaxciudad.min);
                console.log('Máxima: ' +  climaxciudad.max);
                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${ i + 1}.-`.green;
                    console.log(idx + ' ' + lugar);
                })
                break;
        }
        await inquirerPausa();
    } while(opt !== 3);
}

main();