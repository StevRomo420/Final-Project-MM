/*SETUP*/
const language 						= 'es-MX';
const replaceKey 					= 'MOVIE_ID';
const replaceImageSizeKey			= 'IMAGE_SIZE';
const replaceImagePathKey			= 'IMAGE_PATH';
const masterUrl 					= 'https://api.themoviedb.org/3/';
const masterImagePath				= 'https://image.tmdb.org/t/p/';
const apiKey 						= 'ced39d4b339ac642f89d62a237a254bc';
const apiKeyAndLanguageParameter 	= `?api_key=${apiKey}&language=${language}`;

/*PATHS*/
let movieDetails 					= masterUrl.concat('movie/').concat(replaceKey).concat(apiKeyAndLanguageParameter);
let movieImages	 					= masterUrl.concat('movie/').concat(replaceKey).concat('/images').concat(apiKeyAndLanguageParameter);
let imagePath	 					= masterImagePath.concat(replaceImageSizeKey).concat('/').concat(replaceImagePathKey);



//AJAX REQUEST TO TMDB.API
function apiRequest(dataSet){

	$.ajax({

		url: dataSet.url,
		type: 'GET',
		dataType: 'json',
		
		success:(data)=>{
			dataSet.onSuccess(data);
		},

		error:(xhr, status, error)=>{
			dataSet.onFail(xhr,status,error);
		},
		async:false
	});

}