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
-- Name: collections; Type: TABLE; Schema: projet; Owner: {{owner}}; Tablespace: 
--

CREATE TABLE collections (
    id_image integer NOT NULL,
    id_user integer NOT NULL
);


ALTER TABLE projet.collections OWNER TO {{owner}};

--
-- Name: collections_id_image_key; Type: CONSTRAINT; Schema: projet; Owner: {{owner}}; Tablespace: 
--

ALTER TABLE ONLY collections
    ADD CONSTRAINT collections_id_image_key UNIQUE (id_image, id_user);


--
-- Name: collections_id_image_fkey; Type: FK CONSTRAINT; Schema: projet; Owner: {{owner}}
--

ALTER TABLE ONLY collections
    ADD CONSTRAINT collections_id_image_fkey FOREIGN KEY (id_image) REFERENCES images(id);


--
-- Name: collections_id_user_fkey; Type: FK CONSTRAINT; Schema: projet; Owner: {{owner}}
--

ALTER TABLE ONLY collections
    ADD CONSTRAINT collections_id_user_fkey FOREIGN KEY (id_user) REFERENCES users(id);


--
-- PostgreSQL database dump complete
--

