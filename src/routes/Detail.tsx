import styles from "./Detail.module.css";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { BookType } from "./Search.tsx";
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

function Detail() {
    // 들어온 주소값을 가지고 , API 요청을 해서 받아온 데이터를 저장하고, 화면을 출력해준다
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    // 받아오는 데이터가 1개인 API를 대상으로 하고 있기 때문에,
    // 그 response는 객체이고, 이럴 경우엔 초기값을 null로 설정
    const [books, setBooks] = useState<BookType | null>(null);

    useEffect(() => {
        if (!id) return;
        fetch(`https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`)
            .then(res => res.json())
            .then((json: BookType) => {
                setBooks(json);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div className={styles.wrap}>로딩 중입니다...</div>;
    }

    // Search 컴포넌트에서는 list가 초기값도 [], 값이 도착해도 [], 값이 도착하지 않아도 []라서
    // loading을 보여주기 위해서는 따로 loading 관리를 했어야 하는데
    // Detail 컴포넌트에서는 book이 초기값은 null이고, 값이 도착하면 BookType 되고, 값이 도착하지 않으면 null라서
    // book의 값이 있는지 없는지만 체크해줘도 loading 상태를 판별할 수 있음
    if (!books) {
        return <div className={styles.wrap}>존재하지 않는 게시물입니다.</div>;
    }

    return (
        <div className={styles.wrap}>
            <button
                className={styles.backBtn}
                onClick={() => {
                    navigate(-1);
                }}>
                &larr; 뒤로가기
            </button>

            <h2>{books.volumeInfo.title}</h2>
            {books.volumeInfo.imageLinks ? (
                <img className={styles.cover} src={books.volumeInfo.imageLinks.thumbnail} />
            ) : (
                <div className={styles.cover}>No Cover</div>
            )}
            <p>{books.volumeInfo.authors?.join(", ")}</p>
            {/*
                dangerouslySetInnerHTML 속성
                - 사용자가 입력한 내용을 그대로 렌더링할 때 사용
                - 사용할 때 주의가 필요함
                - 혹시라고, 해당 내용에 "악성코드"가 포함이 되어져 있다면
                - 그거조차 그대로 실행됨

                사용법 : dangerouslySetInnerHTML={{ __html: '내용' }}
            */}
            <p dangerouslySetInnerHTML={{ __html: books.volumeInfo.description || "설명 없음" }}></p>
        </div>
    );
}

export default Detail;
