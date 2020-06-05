import React, { useEffect, useState, useRef, useCallback, useReducer } from 'react';
import ReactPlayer from 'react-player';
import { VideosResult } from '../types/VideosResult';
import { searchSugestions, searchVideos, searchAllVideos } from '../APIs/mediaAPI';
import { CardGroup, Card, CardDeck, ListGroup, Button } from 'react-bootstrap';
//import Paginacion, { Props as PagProps} from "../components/Paginacion";
import { useAuth0 } from '../react-auth0-spa';
import { Console } from 'console';
import VideoCard from '../components/VideoCard';
import { Pagination } from '../components/Pagination';



const Home : React.FC = () => {
    
    
    const [catalogo, setCatalogo] = useState<VideosResult[]>([]);


    const [search, setSearch] = useState<string>("")
    const [searchSugestion, setSearchSugestion] = useState<string[]>([])
    const [show, setShow] = useState(false);
    //const { getTokenSilently } = useAuth0();

    // FOR PAGINING
    const [offset, setOffset] = useState<number>(0) // cantidad de videos por pagina
    const [size, setSize] = useState<number>(0) // cantidad de videos totales
    const [pages, setPages] = useState<number[]>([]) // todas las paginas, por ejemplo: [0,1,2,3,4,5,6]
    const [currentPage, setCurrentPage] = useState<number>(0) // La pagina donde esta, si cambia onScroll currentPage ++
    const [pagesToDisplay,] = useState(4)
    //const [scroll, setScroll] = useState<boolean>(false) // Controla si el usuario scrolleo para ver más videos. Arranca en false, no scrolleo
    // FOR PAGINING
    //const [currentCatalogo, setCurrentCatalogo] = useState<VideosResult[]>([]);
    //const [totalRecords, setTotalRecords] = useState<number>(0);
    //AND ANOTHER ONE


  // Llama a la API que busca todos los videos
 const getAllVideos = async (page: number) => {
      
  //const token = await getTokenSilently();
  searchAllVideos(page).then(result => {
    setCatalogo(result.page);
    setOffset(result.offset)
    setSize(result.size)
    //setCurrentCatalogo(catalogo.slice(2));
    //setTotalRecords(catalogo.length);
    setPages(calculatePages(Math.ceil(result.size / result.offset)))
  }).catch((e) => {})     
} 


useEffect((() => 
  {
    document.title = "Home"
    getAllVideos(currentPage)
    console.log("THE CURRENT PAGE: " + currentPage)
  }), [currentPage]);

  // EN EL HOME DEBERIA OBSERVAR UNA PROPIEDAD QUE ME PASAN DESDE APP.TXS QUE SI CAMBIA LLAMO A LA API PARA BUSCAR LOS VIDEOS
  
  
/*  
    const traer = async () => {
        if (gS.msalInstance){
        setIsLoading(true)
        traerBandejas({msalInstance: gS.msalInstance})
            .then(bs => {
                setBandejas(bs)
                setIsLoading(false)
            }).catch(e => setIsLoading(false))
        }
    }

    useEffect((() => {
        document.title = "Inbox"
        traer()
    }), [])

   */

  

   /*
  useEffect((() => 
  {
    console.log("CAMBIE CAMBIE")
    console.log("CURRENT PAGE: " + currentPage)
    searchAllVideos(currentPage).then(result => {
      setCatalogo(result.page);
      //setOffset(result.offset)
      //setSize(result.size)
      //setCurrentCatalogo(catalogo.slice(2));
      //setTotalRecords(catalogo.length);
      //setPages(calculatePages(Math.ceil(result.size / result.offset)))
    }).catch((e) => {})
  }), []); */

   
  
  const next = () => {
    let nextPage = currentPage + 1;
    console.log("next page: " +  nextPage)
    //if (pageNextExist(nextPage)) 
      setCurrentPage(1)
  }

  let pageNextExist = (page: number) => {
    return page < Math.ceil(size / offset)
  }
  
    const calculatePages = (cantPaginas: number) => {
          var paginas :number[] = [];
          for (var i = 0; i < cantPaginas; i++) {
            paginas.push(i)
         }
          return paginas
    }
  

    // Llama a la API que busca las sugerencias
    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
      //console.log("Division con barra: " + Math.ceil(size / offset));
      //console.log(pages);
      //console.log(event.target.value);
      setSearch(event.target.value);
      getSugestions();
      
    }

    // Llama a la API para obtener las sugerencias
    const getSugestions = async () => {
      searchSugestions(search).then(sugestions =>{
        setSearchSugestion(sugestions)
        //props.onGETSugestions("ok");
        //console.log(sugestions)
      }).catch((e:any) => {
        console.log("ERROR BUSCANDO LAS SUGERENCIAS" + e);
        //props.onGETSugestions("bad");
      });
    }
  
    // Llama a la API que busca los videos
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      searchVideos(search).then(videos =>{
        setCatalogo(videos)
        //onCambioVideo(parseInt(videos[0].indice)) // Despues se tiene que sacar !!!!
        //console.log(videos)
        //props.onSubmit(videos.length);
      }).catch(e => {}/*console.log("ERROR BUSCANDO LOS VIDEOS" + e)*/)
      event.preventDefault();
    }

    function sourceurl(id: string){
      return "https://localhost:5001/api/Video/getFileById?fileId="+ id
    }

    const searchFromClicked = () => {
      searchVideos(search).then(videos =>{
        setCatalogo(videos)

      }).catch(e => {
        console.log("ERROR BUSCANDO LOS VIDEOS DESDE LA LISTA DE SUGERENCIAS" + e)
      }) 
    }
    
    function handlePageChange(page: number) {
      console.log(`active page is ${page}`);
      setCurrentPage(page)
      
    }

    
   

    return <>
      <div className="container-fluid">


        
        <div className="col">
          <form onSubmit={handleSubmit} data-testid="busqueda-recomendaciones-submit">
            <input type="text" placeholder="Buscar.." value={search} onChange={handleChange} data-testid="busqueda-recomendaciones-texto" />
            <input type="submit" value="&#128269;" data-testid="busqueda-recomendaciones-boton" />
          </form>

          {/* 
          <select value={search} defaultValue="" onChange={e => setSearch(e.currentTarget.value)}>
              {searchSugestions.length > 0 ? searchSugestion.map(s => <option value={s}>{s}</option>) : <option value={""}>Sin datos</option>}
          </select>
          */}
          <ListGroup>
            {searchSugestions.length > 0 ? searchSugestion.map(search => 
              <ListGroup.Item action onClick={searchFromClicked}>
                    {search}
              </ListGroup.Item>) : <option>Sin datos</option>
            }
            
          </ListGroup>

        </div>
      

      <div className="row" style={{textAlign:"center", marginTop:"3%"}}>
          {
            catalogo.length > 0 ?

            
              catalogo.map(video =>
                
                <div className="col-sm-3">

                  <VideoCard {...video}/>
                                                   
              </div>)
             : <p>No hay resultados para su búsqueda</p>
              
          }   
      </div>

      <br></br>
       

      <div className="container-fluid">
          <div className="row justify-content-center justify-items-center">

            <Pagination totalItems={size} itemsPerPage={offset} page={currentPage} pagesToDisplay={pagesToDisplay} onPageChange={async (e: { target: { innerHTML: string; }; }) => {
                const pageRequested = parseInt(e.target.innerHTML, 10)
                //const paginasTotales = Math.ceil(size / offset)
                setCurrentPage(pageRequested)
            }}
            /> 
          </div>
      </div>
      
      
    </div>
         
    </>
}

export default Home