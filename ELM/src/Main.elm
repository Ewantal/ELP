module Main exposing(..)

import Html exposing (Html, Attribute, div, input, text)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode exposing (..)
import Html exposing (..)
import Browser
import Random 
import Http


-- MAIN


main = Browser.element{ init = init, update = update, subscriptions = subscriptions, view = view}


-- MODEL


type State = Problem String | Success String | Loading

type alias WordMeaning = {partOfSpeech : String, definitions : List Definition}
type alias Datas = { word : String, meanings : List WordMeaning}
type alias Definition = {definition : String}

type alias Model = 
    { http : State
    , jSon : State
    , listOfWords : List String
    , word : String
    , datas : List Datas
    , content : String 
    , displayWord : Bool
    }

init : () -> (Model, Cmd Msg)
init _ =
  ( Model Loading Loading [] "" [] "" False
  , Http.get
      { url = "http://localhost:8000/words.txt"
      , expect = Http.expectString SendHttpRequest
      }
  )


-- UPDATE


type Msg = Change String | SendHttpRequest (Result Http.Error String) | GotJson (Result Http.Error (List Datas)) |  RndWrd Int | DisplayWord

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    SendHttpRequest result ->
      case result of
        Ok words ->
          ({ model | listOfWords = String.split " " words , http = Success "" } , Random.generate RndWrd (Random.int 1 1000))
        Err error ->
          ({model | http = Problem (toString error)}, Cmd.none)
          
    GotJson result -> case result of
                            Ok data-> ({ model | jSon = Success "" , datas = data} , Cmd.none)

                            Err error -> ({ model | jSon = Problem (toString error) } , Cmd.none)   

    Change newContent -> ({model | content = newContent}, Cmd.none)
    
    RndWrd index -> case (getElementAtIndex model.listOfWords index) of
                                Nothing -> (model, Cmd.none)
                                Just wordToFind -> ({ model | word = wordToFind }, Http.get {url = ("https://api.dictionaryapi.dev/api/v2/entries/en/" ++ wordToFind)  , expect = Http.expectJson GotJson listOfDatas})
    DisplayWord -> 
        ({ model | displayWord = not model.displayWord }, Cmd.none)


-- HELPERS


toString : Http.Error -> String 
toString erreur = 
  case erreur of 
    Http.BadUrl err -> "BadUrl" ++ err
    Http.Timeout -> "Timeout"
    Http.NetworkError -> "NetworkError"
    Http.BadStatus err -> "BadStatus" ++ String.fromInt err
    Http.BadBody err -> "BadBody" ++ err


getElementAtIndex : List a -> Int -> Maybe a
getElementAtIndex list index =
    if index < 0 || index >= List.length list then
        Nothing
    else
        List.head (List.drop index list)
        
textDatas : (List Datas) -> List (Html Msg)
textDatas datas = 
  case datas of 
    [] -> []
    (wordToFind :: xs) -> [li [] ([text "Definitions"] ++ [ul [] (textWordMeaning wordToFind.meanings)])] ++ (textDatas xs)
    
textWordMeaning : List WordMeaning -> List (Html Msg)
textWordMeaning meanings = 
  case meanings of
    [] -> []
    (wordToFind :: xs) -> [li [] [text wordToFind.partOfSpeech]] ++ [ol [] (textDef wordToFind.definitions)] ++ (textWordMeaning xs)
    
textDef : List Definition -> List (Html Msg)
textDef def = 
  case def of
    [] -> []
    (wordToFind :: xs) -> [li [] [text wordToFind.definition]] ++ (textDef xs)   
    
overlay : Model -> List (Html Msg) -> Html Msg
overlay model txt = 
  div [] txt
  
          
-- JSON 


listOfDatas : Decoder (List Datas)
listOfDatas = Json.Decode.list datasDecoder

datasDecoder : Decoder Datas
datasDecoder = map2 Datas (field "word" string)(field "meanings" <| Json.Decode.list meaningDecoder)

meaningDecoder : Decoder WordMeaning
meaningDecoder = map2 WordMeaning (field "partOfSpeech" string)(field "definitions" <| Json.Decode.list definitionDecoder)

definitionDecoder : Decoder Definition
definitionDecoder = Json.Decode.map Definition (field "definition" string)


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none


-- VIEW


view : Model -> Html Msg
view model =
  div []
    [ h1 [style "font-weight" "bold"] [ text (if model.displayWord then model.word else "Guess the word !") ]
    , viewWord model
    , div [style "font-weight" "bold"] 
      [label [] [text "Display the word",input [type_ "checkbox", onClick DisplayWord, checked model.displayWord] []]],
      input [ placeholder "Enter the word here", onInput Change ] [],
      p [style "font-weight" "bold"] [ text (if model.content == model.word then "Well played !!!" else " ") ]
    ]

viewWord : Model -> Html Msg
viewWord model =
  case model.http of
    Problem error -> text ("Error while loading the words :'/" ++ error) 
    Loading -> text "Fetching the datas..."
    Success good -> overlay model (
      case model.jSon of
        Success veryGood -> textDatas model.datas
        Loading -> [text "Fetching the datas..."]
        Problem error -> [text ("Error while loading the words :'/" ++ error)] )
