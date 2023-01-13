module Main exposing (main)

import Browser
import Debug
import Html exposing (Html, Attribute, h1,h2,h3,ul,li,div, input, text,label)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick)


-- MAIN

main =
  Browser.sandbox { init = init, update = update, view = view }


-- MODEL

type alias Model ={ content1 : String,content2 : String,isChecked : Bool}

init : Model
init = { content1 = "Type in to guess",content2 = "Guess the word !", isChecked = False }


-- UPDATE

type Msg = Change String | Checkbox | WellPlayed

update : Msg -> Model -> Model
update msg model =
  case msg of
    Change newContent ->
      if newContent == "with" || newContent == "With"then
        { model | content1 = "Well played !" }
      else 
        { model | content1 = "Type in to guess" }
    Checkbox ->
        { model | isChecked = not model.isChecked }
        |> updateContent
    WellPlayed ->
        { model | content2 = "Guess the word !" }

updateContent : Model -> Model
updateContent model =
    if model.isChecked then
        { model | content2 = "With" }
    else
        { model | content2 = "Guess the word !" }

-- VIEW


view : Model -> Html Msg
view model =
  div [] [
        h1[][text(Debug.toString model.content2 |> String.dropLeft 1 |> String.dropRight 1)],
        div [] [
            h2 [] [ text "meaning" ],
            ul [] [
                li [] [
                    text "adverb",
                    ul [] [
                        li [] [ text "Along, together with others, in a group, etc." ]
                    ]
                ],
                li [] [
                    text "preposition",
                    ul [] [
                        li [] [ text "Against." ],
                        li [] [ text "In the company of; alongside, close to; near to." ],
                        li [] [ text "In addition to; as an accessory to." ],
                        li [] [ text "Used to indicate simultaneous happening, or immediate succession or consequence." ],
                        li [] [ text "In support of." ],
                        li [] [ text "In regard to." ],
                        li [] [ text "To denote the accomplishment of cause, means, instrument, etc; – sometimes equivalent to by." ],
                        li [] [ text "Using as an instrument; by means of." ],
                        li [] [ text "Using as nourishment; more recently replaced by on." ],
                        li [] [ text "Having, owning." ],
                        li [] [ text "Affected by (a certain emotion or condition)." ],
                        li [] [ text "Prompted by (a certain emotion)." ]
                    ]
                ],
                li [] [
                    text "noun",
                    ul [] [
                        li [] [ text "A flexible, slender twig or shoot, especially when used as a band or for binding; a withy." ],
                        li [] [ text "A band of twisted twigs." ],
                        li [] [ text "An elastic handle to a tool to save the hand from the shock of blows." ],
                        li [] [ text "An iron attachment on one end of a mast or boom, with a ring, through which another mast or boom is rigged out and secured." ],
                       li [] [ text "A partition between flues in a chimney." ]
                    ]
                ]
            ]
        ],
    div [] [text (Debug.toString model.content1 |> String.dropLeft 1 |> String.dropRight 1)],
    input [ placeholder "Enter text here", onInput Change ] [],
    div [] [label [] [text "Reveal the word",input [type_ "checkbox", onClick Checkbox] []]]
    ]
    