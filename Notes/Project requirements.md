Users need to be able to upload images, parse through them, select which ones to keep, and publish them for anyone to see.
Viewers need to be able to search for peoples accounts to see there photos, these should be sorted by album.
They should be able to like or dislike images.

## Front End Requirements
### Pages
1. Home page
	1. Shows some random featured images
	2. Shows some featured albums
2. Search page
	1. Allows for searching for albums or authors
3. Album page
	1. Allows looking through images
	2. Should use a react image component that gets shared with the homepage
4. Full screen Image view
	1. This could just be a component
5. Author
	1. Let's you look through an authors images
6. Settings
	1. Change your own accounts settings
7. Upload
	1. Starts with picking a folder
	2. Photos selected will be put into an album
	3. Once everything looks good a publish button can be hit

### Navbar
* Home
* Search
* My account

## Back End Requirements

## Database Requirements
* An image database with the owner and album it's in
	* Image
	* Notes (Text)
	* Album
	* Likes
	* Dislikes
* A users database
	* Account name
	* Password
	* Albums published
	* Profile Picture
* An albums database
	* Author
	* Name
	* Note