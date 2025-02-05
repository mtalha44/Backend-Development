//To read data from file 

// const fs = require('fs');
// fs.readFile( "example.txt" , "utf8" , ( err , data ) => {
//     if(err) throw err;
//     console.log(data);
// })

// to read file but synchronously means operation after that code  will be not executed untill file read

// const fs = require('fs');
// const a = fs.readFileSync( "example.txt")
//     console.log(a.toString());
//     console.log("Other operations");

// to write data on file if it is created . if file not exist it will create and write data on it.

// const fs = require('fs');
// fs.writeFile( "example.txt" , "Hello Pakistan!" , (err) => {
//     if(err) throw err;
//     console.log("data is write on it");
// })

// const fs = require('fs');
// const b = fs.writeFileSync( "example.txt" , "Hello Pakistan!" )
// console.log("Other operations");

//to attched content at the end of content of file
// const fs = require('fs');
// fs.appendFile( "example.txt" , "Bilal agya" , ( err , data ) => {
//     if(err) throw err;
//     console.log("append ho gya");
//     // console.log(err,data);
// })

// to delete a file

fs.unlink("example.txt" , (err) => {    
    if(err) throw err;    
    console.log("file deleted");
})
