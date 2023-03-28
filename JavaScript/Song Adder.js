// show a message with a type of the input
function showMessage(input, message, type) {
	// get the small element and set the message
	const msg = input.parentNode.querySelector("small");
	msg.innerText = message;
	// update the class for the input
	input.className = type ? "success" : "error";
	return type;
}

function showError(input, message) {
	return showMessage(input, message, false);
}

function showSuccess(input) {
	return showMessage(input, "", true);
}

function hasValue(input, message) {
	if (input.value.trim() === "") {
		return showError(input, message);
	}
	return showSuccess(input);
}

const NAME_REQUIRED = "Please enter the song's name";
const ARTIST_REQUIRED = "Please enter the song's artist";
const LINK_REQUIRED = "Please enter a youtube link to the song";

form.addEventListener("submit", function(event) {
	// stop form submission
	event.preventDefault();

	// validate the form
	let songNameValid = hasValue(form.elements[0], NAME_REQUIRED);
	let songArtistValid = hasValue(form.elements[1], ARTIST_REQUIRED);
	let songLinkValid = form.elements[2].includes("youtube.com");
	// if valid, submit the form.
	if (songNameValid && songArtistValid && songLinkValid) {
		newSongName = form.elements[0].value;
    newSongArtist = form.elements[1].value;
    newSongLink = form.elements[2].value;
    try{
      localStorage.setItem("newSongName", newSongName);
      localStorage.setItem("newSongArtist", newSongArtist);
      localStorage.setItem("newSongLink", newSongLink);
    } catch(error) {
      alert("Error, Data could not be submitted. Please try again. (If this submessage shows up, don't try, this app is a WIP.)");
    }
	}
	
	
});