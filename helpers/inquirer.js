const inquirer = require('inquirer'); 
require('colors');

const leerInput = async(message) => {
    const question = [{
        type: 'input', 
        name: 'desc',
        message, 
        validate(value){
            if(value.length === 0){
                return 'Por favor ingrese un valor';
            } 
            return true
        }        
    }]; 

    const {desc} = await inquirer.prompt(question);
    return desc;
}

const inquirerMenu = async() =>{
    const opciones = [
        {
            value : 1, 
            name: `${'1'.blue}. Buscar ciudad`
        }, 
        {
            value: 2, 
            name: `${'2'.blue}. Historial`
        }, 
        {
            value: 0, 
            name: `${'0'.blue}. Salir`
        }
    ]; 

    const menu = [
        {
            type: 'list', 
            name: 'preguntas', 
            message: '¿Qué deseas hacer?'.orange, 
            choices: opciones
        }
    ]; 
    console.clear();
    console.log("\n");
    console.log("================================".magenta);
    console.log("Seleccione la opcion".blue);
    console.log("================================\n".magenta);
    const {preguntas} = await inquirer.prompt(menu);
    return preguntas;
}

const pause = async() =>{
    const inputpasuse = [{
        type: 'input', 
        name: pause, 
        message: `Presione ${'ENTER'.green} para continuar`
    }]

    await inquirer.prompt(inputpasuse);
}

const listarLugares = async(lugares = []) =>{
    const choices = lugares.map((lugar, i) => {
        const idx = `${i+ 1}`.green; 
        return {
            value: lugar.id, 
            name: `${idx} ${lugar.name}`
        }
    });    

    choices.unshift({
        value: '0', 
        name: '0'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list', 
            name: 'id', 
            message: 'Selecciona la ciudad: ', 
            choices
        }
    ]; 

    const {id} = await inquirer.prompt(preguntas);
    return id; 
}

module.exports = {
    leerInput, 
    inquirerMenu, 
    pause, 
    listarLugares
}