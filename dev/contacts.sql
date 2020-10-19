--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.19
-- Dumped by pg_dump version 9.6.19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    fname character varying(100) NOT NULL,
    lname character varying(100) NOT NULL,
    birth date NOT NULL,
    gender character varying(6) NOT NULL,
    email character varying(64) NOT NULL,
    address character varying(200)
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contacts_id_seq OWNER TO postgres;

--
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.contacts VALUES (1, 'John', 'Doe', '1960-07-27', 'male', 'John.Doe@mails.com', '45. Street 11 apt. 4, 11200 New York');
INSERT INTO public.contacts VALUES (2, 'Иван', 'Денисович', '1961-07-27', 'male', 'Иван.Денисович@mails.com', 'Движенцев 17, 347658 Moscow');
INSERT INTO public.contacts VALUES (3, 'Ülle', 'Jõekäär', '1992-07-25', 'female', 'Ulle.Joekaar@mails.com', 'Šmidti 11, 20123 Tallinn');
INSERT INTO public.contacts VALUES (4, 'Eric', 'Schwartz', '1961-07-29', 'male', 'Eric.Schwartz@mails.com', 'Alpenstrasse 1, 4500 Oberdorf');
INSERT INTO public.contacts VALUES (5, 'Luis', 'Rodriguez', '1961-07-27', 'male', 'Luis.Rodriguez@mails.com', 'Manhattan, 11000 New York');
INSERT INTO public.contacts VALUES (6, 'Todd', 'Hamilton', '1961-07-27', 'male', 'Todd.Hamilton@mails.com', 'Fulham Road, SW6 1EX London');
INSERT INTO public.contacts VALUES (7, 'Mito', 'Mitsuko', '1961-07-27', 'female', 'Mito.Mitsuko@mails.com', 'Hatagaya, 1-32-3 Tokyo');
INSERT INTO public.contacts VALUES (8, 'Паша', 'Павличенко', '1961-07-27', 'male', 'Паша.Павличенко@mails.com', 'Новоарбатское 6, 584248 Moscow');
INSERT INTO public.contacts VALUES (9, 'Ryan', 'Graham', '1961-07-27', 'male', 'Ryan.Graham@mails.com', 'Chelsea, SW1 9QJ London');
INSERT INTO public.contacts VALUES (10, 'Abby', 'Crary', '1961-07-28', 'female', 'Abby.Crary@mails.com', '350 Fifth Avenue, 10118- New York');
INSERT INTO public.contacts VALUES (11, 'Peeter', 'Tamm', '1961-07-27', 'male', 'Peeter.Tamm@mails.com', 'Võidu 13a, 11240 Tallinn');
INSERT INTO public.contacts VALUES (12, 'Kobo', 'Abe', '1961-07-27', 'male', 'Kobo.Abe@mails.com', 'Mori Tower, 106-0032 Tokyo');
INSERT INTO public.contacts VALUES (13, 'Leo', 'Klammer', '1961-07-27', 'male', 'Leo.Klammer@mails.com', 'Seeburgstrasse 53, 4515 Oberdorf');
INSERT INTO public.contacts VALUES (14, 'Villu', 'Veski', '1961-07-27', 'male', 'Villu.Veski@mails.com', 'Vabaduse 1, 12300 Tallinn');
INSERT INTO public.contacts VALUES (19, 'A', 'B', '2010-01-06', 'male', 'aa@bb.cc', 'NULL');


--
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contacts_id_seq', 1, false);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: contacts_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX contacts_name ON public.contacts USING btree (fname, lname);


--
-- Name: TABLE contacts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contacts TO root;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES  TO root;


--
-- PostgreSQL database dump complete
--

