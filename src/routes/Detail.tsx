import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { BookType } from "./Search.tsx";
import styled from "styled-components";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const Wrap = styled.div`
    padding: 30px;
`;

const BackBtn = styled.button`
    display: flex;
    align-items: center;
    padding: 8px 14px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background-color: #f3f3f3;
    color: #333;
    cursor: pointer;
    transition: all 0.5s;

    &:hover {
        background: #e0e0e0;
        border-color: #999;
    }
`;

const Cover = styled.img`
    width: 200px;
    height: 300px;
    border-radius: 8px;
    margin-bottom: 20px;
`;

const NoCover = styled.div`
    width: 200px;
    height: 300px;
    border-radius: 8px;
    margin-bottom: 20px;
`;

function Detail() {
    // 들어온 주소값을 가지고 , API 요청을 해서 받아온 데이터를 저장하고, 화면을 출력해준다
    const { id } = useParams();
    const navigate = useNavigate();

    // 받아오는 데이터가 1개인 API를 대상으로 하고 있기 때문에,
    // 그 response는 객체이고, 이럴 경우엔 초기값을 null로 설정
    const [books, setBooks] = useState<BookType | null>(null);

    useEffect(() => {
        if (!id) return;
        fetch(`https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`)
            .then(res => res.json())
            .then((json: BookType) => {
                setBooks(json);
            })
            .catch(err => {
                console.log(err);
            });
    }, [id]);


    // Search 컴포넌트에서는 list가 초기값도 [], 값이 도착해도 [], 값이 도착하지 않아도 []라서
    // loading을 보여주기 위해서는 따로 loading 관리를 했어야 하는데
    // Detail 컴포넌트에서는 book이 초기값은 null이고, 값이 도착하면 BookType 되고, 값이 도착하지 않으면 null라서
    // book의 값이 있는지 없는지만 체크해줘도 loading 상태를 판별할 수 있음
    if (!books) {
        return <Wrap>Loading...</Wrap>;
    }

    return (
        <Wrap>
            <BackBtn
                onClick={() => {
                    navigate(-1);
                }}>
                &larr; 뒤로가기
            </BackBtn>

            <h2>{books.volumeInfo.title}</h2>
            {books.volumeInfo.imageLinks ? (
                <Cover src={books.volumeInfo.imageLinks.thumbnail} />
            ) : (
                <NoCover>No Cover</NoCover>
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
        </Wrap>
    );
}

export default Detail;
