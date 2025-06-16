import { css } from '../../../styled-system/css';
import { Search } from "lucide-react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@/components/ui/pagination";
import { InputGroup } from '@/components/ui/input-group';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogActionTrigger
} from "@/components/ui/dialog"

import { Input, Button, Field} from "@chakra-ui/react";
import { getDocumentsByCategory, getDocumentsByUser } from "@/app/services/api";
import { useState, useEffect } from "react";

import EventCalendar from '../eventCalendar/eventCalendar';

import CreateReceptionModal from '../creators/recievedCreator';
import CreateSendedModal from '../creators/sendedCreator';
const pageSize = 7;

const ReceptionCard = ({document}) => {
    return (
        <DialogRoot>
            <DialogTrigger asChild>
                    <Button 
                    key={[document.id, document.type]}
                    className={css({
                                padding: '10px 20px',
                                fontSize: '16px',
                                bg: 'green.500',
                                color: 'white',
                                borderRadius: 'md',
                                gap: '4',
                                _hover: { bg: 'green.600' },
                                width: '80%',
                            })}
                    >{`${document.nro} || ${document.document_type} || ${document.matter}`}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{document.nro}</DialogTitle>
                    <DialogCloseTrigger/>
                </DialogHeader>
                <DialogBody>
                <DialogBody>
                    <p><strong>Administrativo:</strong> {document.administrative}</p>
                    <p><strong>Tipo de documento:</strong> {document.document_type}</p>
                    <p><strong>Número de documento:</strong> {document.document_number}</p>
                    <p><strong>Fecha del documento:</strong> {document.document_date}</p>
                    <p><strong>Fecha de despacho:</strong> {document.deploy_date}</p>
                    <p><strong>Remitente:</strong> {document.sender_or_recipient}</p>
                    <p><strong>Destinatario:</strong> {document.receiver}</p>
                    <p><strong>Materia:</strong> {document.matter}</p>
                    <p><strong>Observaciones:</strong> {document.observations}</p>
                    <p><strong>Categoría:</strong> {document.category_id}</p>
                    <p><strong>Usuario:</strong> {document.user_id}</p>
                </DialogBody>
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger>Cerrar</DialogActionTrigger>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    )
}

const SendedCard = ({document}) => {
    return (
        <DialogRoot>
            <DialogTrigger asChild>
                <Button
                    key={[document.id, document.type]}
                    className={css({
                        padding: '10px 20px',
                        fontSize: '16px',
                        bg: 'green.500',
                        color: 'white',
                        borderRadius: 'md',
                        gap: '4',
                        _hover: { bg: 'green.600' },
                        width: '80%',
                    })}
                >
                    {`${document.nro} || ${document.document_type} || ${document.matter}`}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{document.nro}</DialogTitle>
                    <DialogCloseTrigger/>
                </DialogHeader>
                <DialogBody>
                    <p><strong>Administrativo:</strong> {document.administrative}</p>
                    <p><strong>Tipo de documento:</strong> {document.document_type}</p>
                    <p><strong>Fecha del documento:</strong> {document.document_date}</p>
                    <p><strong>Fecha de despacho:</strong> {document.deploy_date}</p>
                    <p><strong>Remitente:</strong> {document.sender_or_recipient}</p>
                    <p><strong>Materia:</strong> {document.matter}</p>
                    <p><strong>Observaciones:</strong> {document.observations}</p>
                    <p><strong>Categoría:</strong> {document.category_id}</p>
                    <p><strong>Usuario:</strong> {document.user_id}</p>
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger>Cerrar</DialogActionTrigger>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    )
}

const DocumentModal = ({document}) => {
    const modalComponents = {
        'reception': ReceptionCard,
        'sended': SendedCard,
    }

    const Component = modalComponents[document.type];
    return <Component document={document}/>;
}
        


const OFP = ({selectedCategory, user, router}) => {
    const [searchText, setSearchText] = useState('');
    const [count, setCount] = useState(0);
    const [documents, setDocuments] = useState([]);
    const [baseDocuments, setBaseDocuments] = useState([]);
    const [page, setPage] = useState(1);

    const startRange = (page - 1) * pageSize
    const endRange = startRange + pageSize
    const visibleDocuments = documents.slice(startRange, endRange)

    const fetchDocuments = async (category) => {
        const documents = user.role === 'Admin' ? await getDocumentsByCategory(category.id) : await getDocumentsByUser(category.id);        
        setDocuments(documents);
        setBaseDocuments(documents);
        setCount(documents.length);
    };

    useEffect(() => {
        if (selectedCategory) {
            fetchDocuments(selectedCategory);
        }
    }
    , [selectedCategory]);

    const handleSearch = (text) => {
        setSearchText(text);
        const filteredDocuments = baseDocuments.filter((document) => document.matter.toLowerCase().includes(text.toLowerCase()));
        setDocuments(filteredDocuments);
    };

    return (
            <>
                <h1 className={css({ color: 'black', fontSize: 'lg', fontWeight:'bold', padding: '4', paddingBottom: 0 })}>
                  {selectedCategory ? `Documentos en ${selectedCategory.name}` : 'Seleccione una categoría'}
                </h1>
        
                <div className={css({ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '4'})}>
                  <InputGroup startElement={<Search/>}>
                    <Input placeholder='Buscar' value={searchText} onChange={(e) => handleSearch(e.target.value)}></Input>
                  </InputGroup>
                </div>
                <div className={css({ display: 'flex', flexDirection: 'column', gap: '4', height:'65.1%', padding: '4'})}>
                    {visibleDocuments.map((document) => (
                        <div className={css({display: 'flex', flexDirection: 'row'})} key={[document.id, document.type]}>
                            <Field.Root  orientation={'horizontal'}>
                                <Field.Label>{document.type}</Field.Label>
                                <DocumentModal  document={document}/>
                            </Field.Root>
                        </div>
                    ))}
                </div>
                <div className={css({display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'})}>
                  <PaginationRoot>
                    <PaginationPrevTrigger onClick={() => setPage(page - 1)} disabled={page === 1}/>
                    <PaginationItems count={count} pageSize={pageSize} page={page}/>
                    <PaginationNextTrigger onClick={() => setPage(page + 1)} disabled={endRange >= count}/>
                  </PaginationRoot>
                </div>
                    <div className={css({display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'})}>
                    {selectedCategory ? (
                        selectedCategory.name === 'Recibidos' ? (
                            <CreateReceptionModal category={selectedCategory.id} fetch={() => {fetchDocuments(selectedCategory)}}/>
                        ) : selectedCategory.name === 'Enviados' ? (
                            <CreateSendedModal category={selectedCategory.id} fetch={() => {fetchDocuments(selectedCategory)}}/>
                        ) : (
                            <div className={css({display: 'flex', flexDirection: 'row', gap: '4'})}>
                                <CreateReceptionModal category={selectedCategory.id} fetch={() => {fetchDocuments(selectedCategory)}}/>
                                <CreateSendedModal category={selectedCategory.id} fetch={() => {fetchDocuments(selectedCategory)}}/>
                            </div>
                        )
                    ) : null}

                    </div>
                </>
    );

};

export default OFP;