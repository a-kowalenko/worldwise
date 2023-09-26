import Logo from "../components/Logo";
import AppNav from "../components/AppNav";
import Footer from "../components/Footer";
import styles from "./Sidebar.module.css";
import { Outlet } from "react-router-dom";

function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <Logo />
            <AppNav />
            <Outlet />
            <Footer />
        </div>
    );
}

export default Sidebar;
