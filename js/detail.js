/**
 * @author Esteban Taisigue B97785
 * @author Erick Vasquez 	B98334
 * @author Esteban Rosales 	B96967
 * 
 */

document.addEventListener('DOMContentLoaded',function(){

	//PARAM
	const params 			= new URLSearchParams(window.location.search);

	//COMPONENT
	const posterImg 		= $('.poster-img-js');
	const bigPosterImg 		= $('.big-poster-img-js');
	const backImg 			= $('.back-img-js');
	const title				= $('.movie-title-js');
	const length			= $('.movie-length-js');
	const genre				= $('.movie-genre-js');
	const rating			= $('.movie-rating-js');
	const starRating		= $('.stars-js');
	const description		= $('.movie-description-js');
	const premiereDate		= $('.premiere-date-js')
	const movie				= $('.movie-js');
	const warning			= $('.warning-js');
	const errMsg			= $('.error-msg-js');
	const carousel			= $('.carousel-js');
	const backBtn			= $('.back-js');
	const videoIframe		= $('.video-iframe-js');

	const youtubeReplaceKey = 'YT_KEY';
	let youtubeEmbedPath 	= `https://www.youtube.com/embed/${youtubeReplaceKey}?autoplay=1`;
	let moviePath 			= masterUrl.concat('movie/').concat(replaceKey).concat('/videos').concat(apiKeyAndLanguageParameter);


	//INITAL MOVIE FIND CALL
	function findMovie(){

		if(params.has('movie')){

			let movieId=params.get('movie');
			
			if(movieId.length>0){
				apiRequest({
					url:movieDetails.replace(replaceKey,movieId),
					onSuccess:showMovie,
					onFail:onFail
				});
			}else{
				showWarning('Peticion de recurso incorrecta...');
			}

		}else{
			showWarning('No se ha solicitado ningun recurso...');
		}

	}
	
	//SHOW MOVIE DETAILS
	function showMovie(data){

		movie.toggleClass('hidden');
		posterImg.attr('src',(data.poster_path!=null)?imagePath.replace(replaceImageSizeKey,'w200').replace(replaceImagePathKey,data.poster_path):'../img/image_not_found.png');
		posterImg.attr('alt',data.original_title);
		bigPosterImg.attr('src',(data.poster_path!=null)?imagePath.replace(replaceImageSizeKey,'w500').replace(replaceImagePathKey,data.poster_path):'../img/image_not_found.png');
		backImg.attr('src',imagePath.replace(replaceImageSizeKey,'original').replace(replaceImagePathKey,data.backdrop_path));
		backImg.attr('alt',data.original_title);
		bigPosterImg.attr('alt',data.original_title);
		bigPosterImg.toggleClass('animate-pulse',(data.poster_path==null));
		title.text(data.title);
		length.text(data.runtime);
		description.text((data.overview.length>0)?data.overview:'Sin descripcion');
		rating.text(data.vote_average);
		premiereDate.text((data.release_date.length>0)?data.release_date:'No se encontro la fecha');

		showGenresTag(data.genres);
		showStarRating(data.vote_average);
		showCompanies(data.production_companies);
		findVideo(data.id);

		setBackLink();

		$(document).attr('title', `${data.title} | Detalles de la pelicula`);

	}


	function setBackLink(){

		let page = Number(params.has('page')?params.get('page'):1);
		page 	 = (isNaN(page))?1:page;

		const showBy = (params.has('show_by')?params.get('show_by'):'playing_now');
		let backLink =`../?show_by=${showBy}&page=${page}`;


		switch(showBy){

			case "genre":
				if(params.has('genre')){
					let genre = Number(params.get('genre'));
					if(!isNaN(genre)){
						backLink = backLink.concat(`&genre=${genre}`);
					}
				}
				break;
			case "search":
				if(params.has('query')){
					backLink = backLink.concat(`&query=${params.get('query')}`);
				}
				break;

		}

		
		backBtn.attr('href',backLink);

	}


	function findVideo(id){


		apiRequest({
			url:moviePath.replace(replaceKey,id),
			onSuccess:function(data){
				const result=data.results;
				if(result.length>0){
					if(result[0].site=='YouTube'){
						videoIframe.data('video',result[0].key);
						createPLayVideoEventListeners(result[0].key);
					}
				}
			},
			onFail:function(xhr,status,error){
				//Pass
			}
		})

	}



	function showGenresTag(genres){
		
		let genresTag ='';
		genres.forEach(function(genreItem){
			genresTag = genresTag.concat(genreItem.name).concat(',');
		});
		genresTag=genresTag.slice(0,-1);
		genre.text(genresTag);
	
	}

	function showStarRating(vote_average){

		const maxStars = 5;
		let voteStars = (Math.round(vote_average)/2);

		for (let i = 0; i<maxStars; i++) {

			let classTag='';
			
			if(voteStars>=1){
				classTag='fa fa-star';
			}else if((voteStars<1) && (voteStars>0)){
				classTag='fa fa-star-half-o';
			}else{
				classTag='fa fa-star-o';
			}

			voteStars--;

			$('<span>',{class:classTag}).appendTo(starRating);
		}

	}


	function showCompanies(production_companies){
		
		if(production_companies.length>0) {

			production_companies.forEach(function(company){
			
				if(company.logo_path!=null){
					
					let image = $('<img/>',{
						src:imagePath.replace(replaceImageSizeKey,'w200').replace(replaceImagePathKey,company.logo_path),
						class:'w-[100px] h-[100px] m-3 object-center object-contain shadow-2xl dark:bg-gray-400 p-2'
					});

					let div = $('<div>',{
						class:'flex border-2 dark:border-[1px] dark:border-[#262626] md:border-0 md:inline-block',
					});

					image.appendTo(div);
					div.append(`<div class='md:hidden'>
									<span class='font-bold'>Nombre: </span><span>${company.name}</span><br>
									<span class='font-bold'>Pais: </span><span>${company.origin_country}</span>
								</div>`);

					div.appendTo(carousel);

				}

			});

		}else{

			$('<span>',{
				html:'No hay compañías de produccion',
				class:'p-2'
			}).appendTo(carousel);

		}





	}

	function createPLayVideoEventListeners(key){

		$('.play-btn-js').click(function(){	
			videoIframe.attr('src',youtubeEmbedPath.replace(youtubeReplaceKey,videoIframe.data('video')));
			$('.video-box-js').toggleClass('hidden');
		});

		$('.close-video-box-btn-js').click(function(){
			$('.video-box-js').toggleClass('hidden');
			videoIframe.attr('src','');
		});

	}

	function createEventListeners(){
		
		$('.toggle-theme-js').click(function(){
			storageOperations(false);
		});

		posterImg.hover(function(){
			$('.big-poster-js').toggleClass('hidden');
		});


		$('.play-btn-js').hover(function(){
			$('.background-box-js').toggleClass('md:blur-sm');
			backImg.toggleClass('scale-medium');
		});
	
	}


	//ON FAIL REQUEST
	function onFail(xhr,status,error){
	
		if(xhr.responseJSON!=undefined){
			showWarning('No se ha encontrado el recurso solicitado...')
		}else{
			showWarning('Error inesperado...')
		}

	}

	//SHOW WARNING
	function showWarning(msg){
		warning.toggleClass('hidden');
		errMsg.text(msg);
		$('.bottom-wave-js').remove();
	}

	function storageOperations(type){
		
		try{

			const root = document.getElementsByTagName('html')[0];
			let mode = localStorage.getItem('darkThemeMode');

			if(mode==null){mode=false;localStorage.setItem('darkThemeMode',mode);}

			if((type) && (mode=='true')){
				root.classList.toggle('dark');

			}else if(!type){
				root.classList.toggle('dark');
				localStorage.setItem('darkThemeMode',(mode=='false')?true:false);
			}

			document.body.classList.add('transition-colors','duration-800');


		}catch(error){
		}

	}

	function afterLoad(){
		$('.loading-js').toggleClass('hidden').remove();
		$('.bottom-wave-js').toggleClass('hidden');
		$('.theme-mode-js').toggleClass('hidden');
	}

	storageOperations(true);
	findMovie();
	createEventListeners();
	afterLoad();

});