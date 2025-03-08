const greet = require('./greet');
const fs = require('fs').promises;

// For example, take a name from command-line arguments:
const name = process.argv[2] || 'Guest';
const msg = greet(name);

const saveGreetings = async () => {
    try{
        await fs.writeFile('greet.txt' , msg  )
            console.log('Message write successfully');
        
        const data = await fs.readFile('greet.txt' , 'utf8')
            console.log(data);
    }
    catch(err){
        console.log(err)
    }
}

saveGreetings();