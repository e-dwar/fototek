--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

SET search_path = projet, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: users; Type: TABLE; Schema: projet; Owner: {{owner}}; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    login character varying(128) NOT NULL,
    password character varying(128) NOT NULL
);


ALTER TABLE projet.users OWNER TO {{owner}};

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: projet; Owner: {{owner}}
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE projet.users_id_seq OWNER TO {{owner}};

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: projet; Owner: {{owner}}
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: projet; Owner: {{owner}}
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: users_login_key; Type: CONSTRAINT; Schema: projet; Owner: {{owner}}; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_login_key UNIQUE (login);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: projet; Owner: {{owner}}; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

