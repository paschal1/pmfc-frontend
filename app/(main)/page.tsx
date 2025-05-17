import Banner from "./components/Banner"
import CustomerReviews from "./components/CustomerReviews"
import FirstBody from "./components/FirstBody"
import Footer from "./components/Footer"
import PageDropdown from "./components/PageDropdown"
import ProjectControlSection from "./components/ProjectControlSection"
import ProjectSection from "./components/ProjectSection"
import SecondaryFooter from "./components/SecondaryFooter"
import ViewProjects from "./components/ViewProjects"

export default function Home() {
  return (
    <>
      <div className="relative">
        <Banner />
        <FirstBody />
        <ProjectControlSection />
        <ViewProjects />
        <CustomerReviews />
        <SecondaryFooter />
      </div>
    </>
  )
}
