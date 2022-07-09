/*SETUP*/
const language 					= 'es-ES';
const replaceKey 				= 'MOVIE_ID';
const replaceImageSizeKey		= 'IMAGE_SIZE';
const replaceImagePathKey		= 'IMAGE_PATH';
const masterUrl 				= 'https://api.themoviedb.org/3/movie/';
const masterImagePath			= 'https://image.tmdb.org/t/p/';
const apiKey 					= 'ced39d4b339ac642f89d62a237a254bc';
const apiKeyAndLanguajeParam 	= `?api_key=${apiKey}&language=${language}`;


let movieDetails = masterUrl.concat(replaceKey).concat(apiKeyAndLanguajeParam);
let movieImages	 = masterUrl.concat(replaceKey).concat('/images').concat(apiKeyAndLanguajeParam);
let imagePath	 = masterImagePath.concat(replaceImageSizeKey).concat('/').concat(replaceImagePathKey);




function apiRequest(dataSet){

	$.ajax({
		url: dataSet.url,
		type: 'GET',
		dataType: 'json',
		
		success: (data)=>{
			dataSet.onSuccess(data);
		},

		error:(xhr, status, error)=>{
			dataSet.onFail(xhr,status,error);
		}
	});

}