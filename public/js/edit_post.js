var currentUserEmail = "";
var currentUsername = "";
var post_counter = 0;

var timer; //initialized in form.addEventListener

// Get the current user's email and username
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUserEmail = user.email;
        currentUsername = user.displayName;
        console.log(currentUserEmail, "\nuser logged in:\n", user);
        getPostDocNumber();
    }
});

//Formats a string in titlecase format
function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

function getPostDocNumber() {
    firebase.firestore().collection('users').doc(currentUserEmail).get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                console.log('Document data:', doc.data());
                post_counter = doc.data().post_counter;
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
    console.log("successfully got post number");
}

// Listens for file selection
document.getElementById('fileButton').addEventListener('change', function (e) {
    // Gets file
    var file = e.target.files[0];
    // Creates a storage reference ('folder_name/file_name' is how it's stored)
    //var storageRef = firebase.storage().ref();
    //var imageRef = storageRef.child(file.name);
    //var userImageRef = storageRef.child(currentUserEmail + "/" + file.name);
    var storageRef = firebase.storage().ref('images/' + currentUserEmail + '/' + post_counter);
    // Upload file
    var task = storageRef.put(file); //uploads image to storage

    console.log("image uploaded");
});

// delete button
const deleteButton = document.getElementById('delete-post-button');

deleteButton.addEventListener('submit', function (e) {
    e.preventDefault();

    let id = e.target.parentElement.getAttribute('');

    var storageRef = firebase.storage().ref('images/' + currentUserEmail + '/' + post_counter);
    firebase.firestore().collection('posts').doc(currentUserEmail + "." + post_counter).update({
        user: currentUsername,
        user_email: currentUserEmail,
        img_url: url,
        tag1: tagOne,
        tag2: tagTwo,
        tag3: tagThree,
        subject: subj,
        message: msg,
        likes: 0,
        likes_users: [""],
    });

    console.log("deleted");
    //after 2 seconds, redirect the user to the home page, where they can see all of the posts
    timer = window.setTimeout(goToPosts(), 2000);
}, false);

//listen for a submit event when the user clicks "submit" on the form
const form = document.getElementById('edit-post-form');

form.addEventListener('submit', function (e) {
    e.preventDefault(); //prevents page from refreshing

    var tagOne = form.tag1.value;
    if (tagOne == "Other") {
        tagOne = titleCase(form.otherTag1.value);
    }

    var tagTwo = form.tag2.value;
    if (tagTwo == "Other") {
        tagTwo = titleCase(form.otherTag2.value);
    }

    var tagThree = form.tag3.value;
    if (tagThree == "Other") {
        tagThree = titleCase(form.otherTag3.value);
    }

    //if tags are identical, they are made so that they are not
    if (tagOne == tagTwo || tagTwo == tagThree) {
        tagTwo = "Default";
    }

    if (tagOne == tagThree) {
        tagThree = "Default";
    }

    var subj = form.subject.value;
    var msg = form.message.value;

    var storageRef = firebase.storage().ref('images/' + currentUserEmail + '/' + post_counter);
    storageRef.getDownloadURL().then(function (url) {
        // Insert url into an <img> tag to "download"
        //console.log(currentUserEmail + "." + post_counter);
        console.log(url);
        firebase.firestore().collection('posts').doc(currentUserEmail + "." + post_counter).update({
            user: currentUsername,
            user_email: currentUserEmail,
            img_url: url,
            tag1: tagOne,
            tag2: tagTwo,
            tag3: tagThree,
            subject: subj,
            message: msg,
            likes: 0,
            likes_users: [""],
        }, { merge: true });
    });

    console.log("edited");

    //after 2 seconds, redirect the user to the home page, where they can see all of the posts
    timer = window.setTimeout(goToPosts(), 2000);
}, false);

function goToPosts() {
    window.clearTimeout(timer);
    console.log('here');
    window.location.replace("all_posts.html"); //redirects user to home page
}