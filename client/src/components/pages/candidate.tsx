import { useParams } from "react-router";

export default function Candidate() {
    const { id } = useParams<{ id: string }>();

    return (
        <div>
            <h1>Candidate {id}</h1>
        </div>
    );
}