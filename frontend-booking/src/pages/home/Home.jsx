import Featured from "../../components/featured/Featured"
import FeaturedProperties from "../../components/resortProperties/resort"
import Footer from "../../components/footer/Footer"
import Header from "../../components/header/Header"
import MailList from "../../components/mailList/MailList"
import Navbar from "../../components/navbar/Navbar"
import PropertyList from "../../components/propertyList/PropertyList"
import "./Home.css"

const Home = () => {
  return (
    <div>
      <Navbar />
      <Header/>
      <div className="homeContainer">
      <Featured />
      <PropertyList />
      <div className="headerBox"><h1 className="homeTitle"> luxury resort with panoramic ocean views and private pool villas.</h1></div>
      <FeaturedProperties />
      <MailList />
      <Footer />
    </div>
    </div>
  )
}

export default Home
