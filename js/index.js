/**
 * @author Esteban Taisigue B97785
 * @author Erick Vasquez 	B98334
 * @author Esteban Rosales 	B96967
 * 
 */

document.addEventListener('DOMContentLoaded',function(){

	//PARAM
	const params 			= new URLSearchParams(window.location.search);

	//COMPONENTES
	const genresContainer 	= $('.genres-container-js');


	//INITAL MOVIE FIND CALL
	function beginOfIndex(){
		
	}

	function loadGenres(){
		apiRequest({
			url:genrePath,
			onSuccess:function(data){
				data.genres.forEach(function(genre){

					$('<a>',{
						href:`?genre=${genre.id}`,
						html:genre.name
					}).appendTo($('<li>').appendTo(genresContainer));
					
				});
			},
			onFail:function(xhr,status,error){
				console.log(xhr);
			}
		})
	}


	loadGenres();
	beginOfIndex();

	
});