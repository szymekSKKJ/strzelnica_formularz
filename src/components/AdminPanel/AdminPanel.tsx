import Link from "next/link";
import styles from "./styles.module.scss";
import Button from "../UI/Button/Button";
import ammunitionIcon from "../../../public/icons/ammunition.svg";
import Image from "next/image";

const AdminPanel = () => {
  const buttonsData = [
    {
      id: 1,
      href: "/admin_panel/producenci_broni",
      title: "Producenci broni",
      icon: <i className="fa-solid fa-gun"></i>,
    },
    {
      id: 2,
      href: "/admin_panel/producenci_amunicji",
      title: "Producenci amunicji",
      icon: <Image src={ammunitionIcon} alt="Ikona"></Image>,
    },
    {
      id: 3,
      href: "/admin_panel/bronie",
      title: "Bronie",
      icon: <i className="fa-solid fa-gun"></i>,
    },
    {
      id: 4,
      href: "/admin_panel/amunicja",
      title: "Amunicja",
      icon: <Image src={ammunitionIcon} alt="Ikona"></Image>,
    },
  ];

  return (
    <div className={`${styles.adminPanel}`}>
      <div className={`${styles.buttons}`}>
        {buttonsData.map((data) => {
          const { id, href, title, icon } = data;

          return (
            <Link key={id} href={href}>
              <Button>
                <div className={`${styles.iconWrapper}`}>{icon}</div>
                {title}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPanel;
