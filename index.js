require('colors')
require('dotenv').config()

const { leerInput, inquirerMenu, pause, listarLugares } = require("./helpers/inquirer");
const Busquedas = require('./models/busquedas');

const main = async () => {
    //const saludo = await leerInput("Hola");
    //console.log(saludo);
    const busquedas = new Busquedas();
    let opt = 0;
    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                // mostrar mensaje
                const ciudad_buscar = await leerInput('Ciudad: ');                
                
                //buscar lugares
                const lugares =  await busquedas.ciudad(ciudad_buscar); 

                // seleccionar el lugar
                const id = await listarLugares(lugares);
                if(id === '0') continue;

                const lugarSel = lugares.find(lu => lu.id === id);
                //console.log(lugarSel);

                 //Agregar al historial 
                busquedas.agregarhistorial(lugarSel.name);

                //clima 
                const clima = await busquedas.climaLugar(lugarSel.lng, lugarSel.lat) 
                
                //mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSel.name.blue);
                console.log('Lat: ', lugarSel.lat);
                console.log('Lng: ', lugarSel.lng);
                console.log('Temperatura: ', clima.temp );
                console.log('Mínima: ', clima.temp_min);
                console.log('Máxima: ', clima.temp_max);
                console.log('Descripcion',clima.des.blue,'\n')
            break;
            
            case 2: 
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green; 
                    console.log(`${idx} ${lugar}`);
                });
                console.log('\n');
                
                
            break;
        }
      

        if (opt !== 0) await pause();

    } while (opt !== 0);
}

main();