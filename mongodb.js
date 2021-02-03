const mongodb = require('mongodb');
const { MongoClient, ObjectID } = mongodb;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

// const id = new ObjectID();
// console.log(id);

MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if(error){
        return console.log('Unable to connect to database');
    }
    const db = client.db(databaseName);
    // db.collection('users').insertOne({
    //     name: "Ramu",
    //     age: 26
    // }, (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert new user');
    //     }
    //     console.log(result.ops);
    // })
    // db.collection('users').insertMany([
    //     {
    //         name: "Virat",
    //         age: 32
    //     },
    //     {
    //         name: "Smith",
    //         age: 34
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log('Error inserting documents!');
    //     }
    //     console.log(result.ops);
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: "NodeJS",
    //         completed: false
    //     },
    //     {
    //         description: "Angular",
    //         completed: true
    //     },
    //     {
    //         description: "ReactJS",
    //         completed: true
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log('Error inserting documents');
    //     }
    //     console.log(result.ops);
    // })
    // db.collection('users').findOne({name: 'Ramu'}, (error, user) => {
    //     if(error){
    //         return console.log('Unable to fetch data')
    //     }
    //     console.log(user);
    // })
    // db.collection('tasks').findOne({_id: new ObjectID("5fc0962ace596c5ad4a9819d")},(error, user) => {
    //     if(error){
    //         return console.log('Unable to fetch the data');
    //     }
    //     console.log(user);
    // })

    // db.collection('tasks').find({ completed: false }).toArray((error, userData) => {
    //     if(error){
    //         return console.log('Error finding the data');
    //     }
    //     console.log(userData);
    // })

    // db.collection('tasks').find({completed: true}).count((error, count) => {
    //     console.log(count);
    // })

    // const updatePromise = db.collection('users').updateOne(
    //     {
    //         name: 'Smith'
    //     },
    //     {
    //         $set: {
    //             name: 'Root'
    //         }
    //     }
    // )
    // updatePromise.then(result => {console.log(result)}).catch(error => console.log(error))
    // const promise = db.collection('tasks').updateMany({ completed: false}, {
    //     $set: {
    //         completed: true
    //     }
    // })
    // promise.then(result => {
    //     console.log(result.modifiedCount)
    // }).catch(error => {
    //     console.log(error);
    // })
    // const deletePromise = db.collection('tasks').deleteOne({
    //     description: 'ReactJS'
    // })
    // deletePromise.then(result => {
    //     console.log(result.deletedCount);
    // }).catch(error => {
    //     console.log(error);
    // })
    const deleteMultTasks = db.collection('tasks').deleteMany({
        completed: true
    })
    deleteMultTasks.then(result => {
        console.log(result.deletedCount);
    }).catch(error => {
        console.log(error);
    })
})