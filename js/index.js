/**
 * @author Esteban Taisigue B97785
 * @author Erick Vasquez 	B98334
 * @author Esteban Rosales 	B96967
 * 
 */

document.addEventListener('DOMContentLoaded',function(){

	//PARAM
	const params 			= new URLSearchParams(window.location.search);

	//PATHS
	const pageReplaceKey 	= 'PAGE_NUMBER';

	const genrePath			= masterUrl.concat('genre/movie/list').concat(apiKeyAndLanguageParameter);
	const latestMovies		= masterUrl.concat('movie/latest').concat(apiKeyAndLanguageParameter);
	let nowPlayingMovies 	= masterUrl.concat('movie/now_playing').concat(apiKeyAndLanguageParameter).concat(`&page=${pageReplaceKey}`);

	//COMPONENTES
	const genresContainer 	= $('.genres-container-js');
	const moviesContainer  	= $('.movies-js');
	const currentTag  		= $('.current-tag-js');

	let genres=[];


	//INITAL MOVIE FIND CALL
	function beginOfIndex(){
		
		if(params.has('showBy')){
			
			const showBy = params.get('showBy');

			if(showBy){

				console.log(showBy);
			}else{

				console.log('NOPE');
			}

		}else{
			loadMovies(nowPlayingMovies.replace(pageReplaceKey,1),'peliculas nuevas');
		}

	}


	function loadMovies(url,tag){

		currentTag.text(tag)

		apiRequest({
			url:url,
			onSuccess:function(data){

				data.results.forEach(function(movie){

					let genresTag ='';
					movie.genre_ids.forEach(function(genreItem){
						genresTag+=`${genres.find(g=>g.id==genreItem).name},`;
					});
					genresTag=genresTag.slice(0,-1);

					const poster = imagePath.replace(replaceImageSizeKey,'w400').replace(replaceImagePathKey,movie.poster_path)
					const detail = `view/detail.html?movie=${movie.id}`;
					const description = ((movie.overview.length>60)?movie.overview.substring(0,60):movie.overview).concat('...');

					let movieItem = $('<div>',{

						class:'movie-item flex bg-gray-100 px-2 rounded shadow-4xl border-b-4 m-2 md:m-0',

						html:`
		                    <div class="left-container w-[240px] md:w-[150px] overlap-box 2xl:w-[170px]">
		                        <img src="${poster}" class="overlap-item relative w-full h-full object-cover object-center top-[-2px]"/>
		                        <div class="overlap-item z-20 self-end mb-2 flex flex-col">
		                            <span class="rounded-full relative bg-teal-300 p-3 text-white self-end right-[-25px]">8.2</span>
		                        </div>
		                        <div class="overlap-item z-20 self-center flex justify-center">
		                            <a href="${detail}" class="hover:animate-bounce"> 
		                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="inside-svg" viewBox="0 0 16 16">
		                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
		                                    <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
		                                </svg>
		                            </a>
		                        </div>
		                    </div>
		                    <div class="right-container md:w-[180px] ml-2 p-1 2xl:w-[150px]">
		                        <span class="item-title block font-bold text-xl text-center tracking-tight">${movie.title}</span>
		                        <hr>
		                        <span class="item-genres block break-all text-sm text-gray-500 tracking-tighter">${genresTag}</span>
		                        <span class="item-length-span block p-1">
		                            <span class="item-length bg-orange-500 text-white font-bold rounded p-1"><span class="item-length">105</span>min</span>
		                        </span>
		                        <div class="description-box flex flex-col font-sans">
		                            <p class="tracking-tight break-all p-1">
		                                <span class="item-description">
		                                    ${description}
		                                </span>
		                            </p>
		                            <a href="${detail}" class="inline-block self-end text-teal-400 hover:text-teal-300 hover:underline">detalles</a>
		                        </div>
		                        <div class="control-box">
		                             <div class="flex justify-end">
		                                <svg xmlns="http://www.w3.org/2000/svg" class="m-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
		                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
		                                </svg>
		                                <svg xmlns="http://www.w3.org/2000/svg" class="m-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
		                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"></path>
		                                </svg> 
		                             </div>
		                        </div>
		                    </div>
						`	
					});

					movieItem.appendTo(moviesContainer);

				});
			},
			onFail:function(xhr,status,erro){

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
	console.log('RELOAD')
	
});