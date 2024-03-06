import { errorCatch } from "@/$api/api.helpers";
import authService from "@/service/auth-service/auth.service";
import Button from "@/shared/ui/button/Button";
import fromatPhone from "@/shared/utils/setPhone";
import { setState } from "@/store/slice/registretion-seller.slice";
import { setUserRegisterion } from "@/store/slice/registretion-user.slice";
import clsx from "clsx";
import Link from "next/link";
import { FC, useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import styles from "./ResetModal.module.scss";
import { TypePropsResetModel } from "./ResetModel.type";
const ResetModal: FC<TypePropsResetModel> = ({ onClick, setRole, setNextPage }) => {
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
	const dispatch = useDispatch();
  const submitHandle =	async () => {
    try {	
      const res = await authService.getCode(fromatPhone(phone), true);
      if (res.role === "seller") {
        dispatch(
          setState({
            code: res.code,
          })
        );
        setRole("registerSeller");
      } else {
        dispatch(
          setUserRegisterion({
            code: res.code,
          })
        );
        setRole("registerUser");
      }
			localStorage.setItem('phone', phone)
      setNextPage();
    } catch (error) {
			setError(errorCatch(error));
		}
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <div></div>
        <div>
          <p>Подтвердите номер</p>
        </div>
        <IoClose onClick={onClick} />
      </div>
      <span>
        Введите телефон или емейл, нажмите восстановить. Мы пришлем на Ваш емейл
        ссылку/код для восстановления доступа.
      </span>
      <div className={styles.pin}>
        <div className={clsx(styles.item)}>
          <input
            className={clsx(styles.input, error ? styles.error : styles.border)}
            id={"phone"}
            placeholder={"Телефон"}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <label htmlFor={"phone"}>Телефон</label>
          {error && <p>{error}</p>}
          <FaEye />
        </div>
        <span>
          Если этот способ не помог, напишите нам через форму обратной связи с
          данными, которые указали при регистрации.
        </span>
        <Button onClick={() => submitHandle()} className={styles.button}>
          Далее
        </Button>
      </div>
      <div className={styles.bottom}>
        <p>У вас нет аккаунта?</p>
        <Link href={"/"}>Зарегестрироваться</Link>
      </div>
    </div>
  );
};

export default ResetModal;
