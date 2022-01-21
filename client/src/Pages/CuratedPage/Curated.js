import "./Curated.css";
import cube from "./cube.mp4";
import gift from './gift.mp4';
import merge from './merge.svg';

function Curated(){
    return (
        <div>
            <div className='issue'>Issue No. 1</div>
        <div className='article'>
            <div className="Title">This is Pak.</div>
            {/* <div className="subtitle">Extra details</div> */}

            <div className="body">Murat Pak, or better known yet as Pak, is an anonymous designer, technologist, programmer and digital creator who has been active
            over two decades in design, coding, digital art, and motion design. More recently, Pak is an active crypto art and NFT creator. In his NFTs, Pak is known for a style that
            uses clean, monochrome, geometric structures, and AI image generation.</div>
            <br></br>
            <video className="video" autoPlay muted loop>
                <source src={cube} type='video/mp4'/>
            </video>
            <div className="image_info">"The Fungible" by Pak</div>
            <br></br>
            <div className="body"> In his works, Pak is particularly known for challenging and questioning such concepts as value, ownership,
            and art and often forces his collectors to choose between different scenarios. For example, Pak created the concept of the "Open Edition" NFT,
            whereby NFT releases were not limited by number but by the amount of time they are available for. Open Editions have since
            become a standard drop model for NFT releases.</div>
            <br></br>
            <video className="video" autoPlay muted loop>
                <source src={gift} type='video/mp4'/>
            </video>
            <div className="image_info">"The Title", sold using an Open Edition format.</div>
            <br></br>
            <div className="body">Pak's works have been sold on platforms such as Sotheby's, SuperRare, Nifty Gateway, MakersPlace, and Async Art.
            Notably, between December 2 and December 4, Pak's "The Merge" sold 250,000 NFTs for $91.8 million on Nifty Gateway, in what the NFT platform
             called the "largest ever art sale by a living creator."</div>
            <br></br>
            <img className="image" src={merge} alt="Merge NFT"></img>
            <div className="image_info">"The Merge", which sold for a record number of sales amounting to $91.8 million.</div>
        </div>
        </div>
    )
   
}

export default Curated;