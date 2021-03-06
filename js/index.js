/**
 * @author Esteban Taisigue B97785
 * @author Erick Vasquez 	B98334
 * @author Esteban Rosales 	B96967
 * 
 */

document.addEventListener('DOMContentLoaded',function(){

	//PARAM
	const params 				= new URLSearchParams(window.location.search);

	//KEYS
	const pageReplaceKey 		= 'PAGE_NUMBER';
	const replaceGenreKey		= 'GENRE_KEY';
	const replaceSearchQueryKey = 'SEARCH_QUERY';

	//PATHS
	const genrePath				= masterUrl.concat('genre/movie/list').concat(apiKeyAndLanguageParameter);
	let nowPlayingMovies 		= masterUrl.concat('movie/now_playing').concat(apiKeyAndLanguageParameter).concat(`&page=${pageReplaceKey}`);
	let popularMovies 			= masterUrl.concat('movie/popular').concat(apiKeyAndLanguageParameter).concat(`&page=${pageReplaceKey}`);
	let listByGenre 			= `https://api.themoviedb.org/3/discover/movie${apiKeyAndLanguageParameter}&with_genres=${replaceGenreKey}&page=${pageReplaceKey}`;
	let searchPath				= masterUrl.concat('search/movie').concat(apiKeyAndLanguageParameter).concat(`&query=${replaceSearchQueryKey}=&page=${pageReplaceKey}`);


	//COMPONENTS
	const genresContainer 		= $('.genres-container-js');
	const moviesContainer  		= $('.movies-js');
	const currentTag  			= $('.current-tag-js');
	const currentTitle  		= $('.selected-a-js');
	const loading				= $('.loading-js');
	const showQuerySearch		= $('.show-query-search-js');
	const noResults				= $('.no-results-js');

	//RES
	const imageNotFound			= './img/image_not_found.png';

	let genres=[];


	//INITAL MOVIE FIND CALL
	function beginOfIndex(){

		let page = Number(params.has('page')?params.get('page'):1);
		page 	 = (isNaN(page))?1:page;
		
		let showBy = (params.has('show_by')?params.get('show_by'):'playing_now');


		let loadParams = {
			search:null,
			page:page,
			title:'',
			APIUrl:'',
			pageParams:`show_by=${showBy}&page=${pageReplaceKey}`,
		};


		switch(showBy){

			case "search":

				const query = (params.has('query'))?params.get('query'):'';

				loadParams.title='Busqueda';
				loadParams.search=query;
				loadParams.APIUrl=searchPath.replace(replaceSearchQueryKey,query);
				loadParams.pageParams = loadParams.pageParams.concat(`&query=${query}`);

				break;

			case "genre":

				const getGenre = Number((params.has('genre'))?params.get('genre'):genres[0].id);
				const genre = (isNaN(getGenre))?genres[0].id:getGenre;

				loadParams.title = genres.find(g => g.id == genre).name;
				loadParams.APIUrl=listByGenre.replace(replaceGenreKey,genre);
				loadParams.pageParams = loadParams.pageParams.concat(`&genre=${genre}`);
				
				break;
			
			case "popular":
				
				loadParams.title='Populares';
				loadParams.APIUrl=popularMovies;	
				
				break;

			case "playing_now":
				
				loadParams.title='Peliculas Nuevas';
				loadParams.APIUrl=nowPlayingMovies;
				
				break;
				
			default:
				
				loadParams.title='Peliculas Nuevas';
				loadParams.APIUrl=nowPlayingMovies;
		}
	

		loadParams.APIUrl=loadParams.APIUrl.replace(pageReplaceKey,page);
		loadMovies(loadParams);

	}


	function loadMovies(loadParams){


		currentTag.text(loadParams.title);
		$(document).attr('title', `${loadParams.title} | Pagina ${loadParams.page}`);
		currentTitle.text(loadParams.title);

		apiRequest({

			url:loadParams.APIUrl,

			onSuccess:function(data){

				if(data.results.length>0){

					if(loadParams.search!=null){
						showQuerySearch.toggleClass('hidden').text(`Busqueda:Mostrando resultados para "${loadParams.search}".`);
					}

					const eachMovieDetailLink = `view/detail.html?movie=${replaceKey}&${loadParams.pageParams.replace(pageReplaceKey,loadParams.page)}` ;

					data.results.forEach(function(movie){

						const poster 		= (movie.poster_path!=null)?imagePath.replace(replaceImageSizeKey,'w400').replace(replaceImagePathKey,movie.poster_path):imageNotFound;
						const description 	= (movie.overview.length>0)?movie.overview.split(' ').slice(0,12).join(' ').concat('...'):'Sin descripcion.';


						let genresTag 		= '';
						movie.genre_ids.forEach(function(genreItem){				
							genresTag  		+= `${genres.find(g=>g.id==genreItem).name},`;
						});
						genresTag 			= genresTag.slice(0,-1);


						const movieItem = $('<div>',{

							class:'movie-item flex bg-gray-100 px-2 rounded shadow-4xl border-b-4 m-2 md:m-0 justify-around',

							html:`
			                    <div class="left-container w-[150px] md:w-[150px] overlap-box 2xl:w-[170px] bg-[rgba(0,0,0,0.5)]">
			                        <img src="${poster}" class="overlap-item relative w-full h-full object-cover object-center top-[-2px]" alt="${movie.title}" title="${movie.title}"/>
			                        <div class="overlap-item z-20 self-end mb-2 flex flex-col">
			                            <span class="rounded-full relative bg-teal-300 p-3 text-white self-end right-[-25px] w-[50px] h-[50px] text-center dark:bg-[#5600e8]">${movie.vote_average}</span>
			                        </div>
			                        <div class="overlap-item z-20 self-center flex justify-center">
			                            <a href="${eachMovieDetailLink.replace(replaceKey,movie.id)}" class="hover:animate-bounce "> 
			                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="inside-svg hover:text-yellow-300 transition-colors transition-1000" viewBox="0 0 16 16">
			                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
			                                    <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
			                                </svg>
			                            </a>
			                        </div>
			                    </div>
			                    <div class="right-container w-[45%] md:w-[180px] ml-2 p-1 2xl:w-[150px] flex flex-col">
			                        <a href="${eachMovieDetailLink.replace(replaceKey,movie.id)}" class="item-title block font-bold text-xl text-center tracking-tight dark:text-gray-200 hover:underline dark:text-[#745E91] dark:hover:text-yellow-300">${movie.title}</a>
			                        <hr>
			                        <span class="item-genres block break-all text-sm text-gray-500 tracking-tighter dark:text-white">${genresTag}</span>
			                        <div class="description-box flex flex-col font-sans border-[1px] dark:border-[#262626]">
			                            <p class="tracking-tight p-1">
			                                <span class="item-description dark:text-gray-200 dark:font-semibold">
			                                    ${description}
			                                </span>
			                            </p>
			                            <a href="${eachMovieDetailLink.replace(replaceKey,movie.id)}" class="inline-block self-end text-teal-400 hover:text-teal-300 hover:underline dark:text-[#745E91] dark:hover:text-[#967ABC] dark:font-semibold">detalles</a>
			                        </div>
			                        <div class="control-box mt-auto pt-2">
			                             <div class="flex justify-end text-yellow-300">
			                                <svg xmlns="http://www.w3.org/2000/svg" class="hover:text-[gold] m-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
			                                </svg>
			                                <svg xmlns="http://www.w3.org/2000/svg" class="hover:text-[gold] m-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"></path>
			                                </svg> 
			                             </div>
			                        </div>
			                    </div>
							`	
						});

						movieItem.appendTo(moviesContainer);

					});


					//PREV CURRENT NEXT -> PAGE
					$('.prev-js').toggleClass('hidden',(loadParams.page<=1)).attr('href',(loadParams.page>1)?`./?${loadParams.pageParams.replace(pageReplaceKey,(loadParams.page-1))}`:'#');
					$('.page-number-js').text(`Pagina ${loadParams.page}`);
					$('.next-js').toggleClass('hidden',((loadParams.page>=500) || (data.page>=data.total_pages))).attr('href',`./?${loadParams.pageParams.replace(pageReplaceKey,(loadParams.page+1))}`);
					$('.pages-navigation-js').toggleClass('hidden');

					console.log(data);

				}else{
					noResults.toggleClass('hidden');
				}



				loading.toggleClass('hidden');
				loading.remove();

			},
			onFail:function(xhr,status,erro){
				console.log(status);
			}
		})
	}


	function loadGenres(){
		apiRequest({
			url:genrePath,
			onSuccess:function(data){

				genres =data.genres;

				genres.forEach(function(genre){

					$('<a>',{
						href:`./?show_by=genre&genre=${genre.id}&page=1`,
						html:genre.name
					}).appendTo($('<li>').appendTo(genresContainer));
					
				});
			},
			onFail:function(xhr,status,error){
				console.log(xhr);
			}
		});
	}

	

	function createEventListeners(){
		$('.toggle-theme-js').click(function(){
			storageOperations(false);
		});
	}

	loadGenres();
	beginOfIndex();
	createEventListeners();

	
});