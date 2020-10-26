import React, { useEffect, useState } from "react";
import uuid from "uuid";
import cardImages from "../../cards";
import Card from "../Card/Card";
import deepcopy from "deepcopy";

function shuffleArray(array) {
    return array.sort(() => .5 - Math.random());
}

function generateCards(count) {
    if (count % 2 !== 0)
        throw "Count must be even: 2, 4, 6, etc. but it is " + count;

    const cards = shuffleArray(cardImages)
        .slice(0, count / 2)
        .map(imageURL => ({
            id: uuid.v4(),
            imageURL: "static/images/cards/" + imageURL,
            isFlipped: false,
            canFlip: true
        }))
        .flatMap(e => [e, { ...deepcopy(e), id: uuid.v4() }]);

    return shuffleArray(cards);
}

export default function Game({ fieldWidth = 6, fieldHeight = 3 }) {
    const totalCards = fieldWidth * fieldHeight;

    const [cards, setCards] = useState(generateCards(totalCards));
    const [canFlip, setCanFlip] = useState(false);
    const [firstCard, setFirstCard] = useState(null);
    const [secondCard, setSecondCard] = useState(null);
    const [finished, setFinished] = useState(false);
    const [allCardsFlipped, setAllCardsFlipped] = useState(false);

    function setCardIsFlipped(cardID, isFlipped) {
        return setCards(prev => prev.map(c => {
            if (c.id !== cardID)
                return c;
            return { ...c, isFlipped };
        }));
    }

    function setCardCanFlip(cardID, canFlip) {
        setCards(prev => prev.map(c => {
            if (c.id !== cardID)
                return c;
            return { ...c, canFlip };
        }));
    }

    // showcase
    useEffect(() => {
        setTimeout(() => {
            let index = 0;
            for (const card of cards) {
                setTimeout(() => setCardIsFlipped(card.id, true), index++ * 100);
            }
            setTimeout(() => setCanFlip(true), cards.length * 100);
        }, 1000);
    }, []);


    function resetFirstAndSecondCards() {
        setFirstCard(null);
        setSecondCard(null);
    }

    function onSuccessGuess() {
        if (cards && cards.filter(c => c.isFlipped).length === 0) {
            setAllCardsFlipped(true);
        }
        setCardCanFlip(firstCard.id, false);
        setCardCanFlip(secondCard.id, false);
        setCardIsFlipped(firstCard.id, false);
        setCardIsFlipped(secondCard.id, false);
        resetFirstAndSecondCards();
    }

    function onFailureGuess() {
        const firstCardID = firstCard.id;
        const secondCardID = secondCard.id;

        setTimeout(() => {
            setCardIsFlipped(firstCardID, true);
        }, 1000);
        setTimeout(() => {
            setCardIsFlipped(secondCardID, true);
        }, 1200);

        resetFirstAndSecondCards();
    }

    useEffect(() => {
        if (!firstCard || !secondCard)
            return;
        (firstCard.imageURL === secondCard.imageURL) ? onSuccessGuess() : onFailureGuess();
    }, [firstCard, secondCard]);


    function onCardClick(card) {
        if (!canFlip)
            return;
        if (!card.canFlip)
            return;

        if ((firstCard && (card.id === firstCard.id) || (secondCard && (card.id === secondCard.id))))
            return;

        setCardIsFlipped(card.id, false);

        (firstCard) ? setSecondCard(card) : setFirstCard(card);
    }

    return <div>

        {!finished && (<React.Fragment>
            <div className="explanation container-md">
                <h1>Cas' 30th Birthday game</h1>
                <h2>Find 2 couples that look the same</h2>
            </div>
            <div className="game container-md">
                <div className="cards-container">
                    {cards.map(card => <Card onClick={() => onCardClick(card)} key={card.id} {...card}/>)}
                </div>
            </div>
        </React.Fragment>)}

        {!finished && allCardsFlipped && (
            <div className="explanation container-md">
                <a className="link" onClick={() => setFinished(true)}>Click here to continue</a>
            </div>
        )}
        {finished && (
            <>
                <div className="finished-container container-md">
                    <div className="explanation">
                        <h1>Cas' 30th Birthday</h1>
                        <h2>03 / 11 / 2020</h2>
                        <h3>Weekend &nbsp; timeline</h3>
                    </div>
                    <div className="row">
                        <div className="left">
                            Thursday <br/> November 19th
                        </div>
                        <div className="right">
                            <ul>
                                <li>11:00 AM - Start driving</li>
                                <li>03:00 PM - Check-in - <a className="link" target="_blank"
                                                             href="https://www.airbnb.com.au/rooms/18976469?source_impression_id=p3_1603666463_oqrDDBGDZe4dqzWe">Airbnb</a>
                                </li>
                                <li>05:00 PM - Aperitif - Sparkling</li>
                                <li>07:40 PM - Formaggio e Vino Sunset</li>
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="left">Friday<br/> November 20th</div>
                        <div className="right">
                            <ul>
                                <li>8:00 AM - Sailing with the <a className="link" target="_blank"
                                                                  href="https://www.airbnb.com.au/experiences/1475936?source=pdpother">beach explorer</a>
                                </li>
                                <li>1:00 PM - Two Figs Winery</li>
                                <li>3:00 PM - Explore garden</li>
                                <li>7:40 PM - Cibo e Vino Sunset</li>
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="left">Saturday<br/> November 21st</div>
                        <div className="right">
                            <ul>
                                <li>05:30 AM - Sunrise</li>
                                <li>08:00 AM - Tennis</li>
                                <li>10:00 AM - Check-out</li>
                                <li>10:30 AM - The best Donuts & Coffee</li>
                            </ul>
                        </div>
                    </div>

                </div>
                <div className="image-container">
                    <img
                        src="https://a0.muscache.com/im/pictures/238186b1-80ac-4d09-8ce4-be15fe06bac1.jpg?aki_policy=large"/>
                    <img
                        src="https://a0.muscache.com/im/pictures/e01179a1-01dc-450a-8ebd-0b04a0e3a6ff.jpg?aki_policy=large"/>
                    <img
                        src="https://a0.muscache.com/im/pictures/3481ed29-d4fe-47f0-841f-40473a810098.jpg?aki_policy=large"/>

                </div>
            </>
            )}
            </div>;
        }
