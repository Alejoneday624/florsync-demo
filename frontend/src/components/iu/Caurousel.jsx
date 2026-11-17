import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SlickSlider from "react-slick";

export default function Carousel() {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    customPaging: () => <div></div>,
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 md:mt-10">
      <SlickSlider {...settings}>
        <div>
          <img 
            src="/images/girasoles.jpeg" 
            alt="Girasoles" 
            className="w-full max-h-[180px] md:max-h-[820px] rounded-lg object-cover"
          />
        </div>
        <div>
          <img 
            src="/images/ramo_rosas_rosadas.jpeg" 
            alt="Ramo de rosas rosadas" 
            className="w-full max-h-[180px] md:max-h-[820px] rounded-lg object-cover"
          />
        </div>
        <div>
          <img 
            src="/images/corazon_de_rosas.jpeg" 
            alt="Corazón de rosas" 
            className="w-full max-h-[180px] md:max-h-[820px] rounded-lg object-cover"
          />
        </div>
        <div>
          <img 
            src="/images/bucket.png" 
            alt="Arreglo floral" 
            className="w-full max-h-[180px] md:max-h-[820px] rounded-lg object-cover"
          />
        </div>
      </SlickSlider>
    </div>
  );
}
