package br.com.viajato.web.rest;

import com.codahale.metrics.annotation.Timed;
import br.com.viajato.domain.Reserva;
import br.com.viajato.repository.ReservaRepository;
import br.com.viajato.web.rest.errors.BadRequestAlertException;
import br.com.viajato.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Reserva.
 */
@RestController
@RequestMapping("/api")
public class ReservaResource {

    private final Logger log = LoggerFactory.getLogger(ReservaResource.class);

    private static final String ENTITY_NAME = "reserva";

    private final ReservaRepository reservaRepository;

    public ReservaResource(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    /**
     * POST  /reservas : Create a new reserva.
     *
     * @param reserva the reserva to create
     * @return the ResponseEntity with status 201 (Created) and with body the new reserva, or with status 400 (Bad Request) if the reserva has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/reservas")
    @Timed
    public ResponseEntity<Reserva> createReserva(@Valid @RequestBody Reserva reserva) throws URISyntaxException {
        log.debug("REST request to save Reserva : {}", reserva);
        if (reserva.getId() != null) {
            throw new BadRequestAlertException("A new reserva cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Reserva result = reservaRepository.save(reserva);
        return ResponseEntity.created(new URI("/api/reservas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /reservas : Updates an existing reserva.
     *
     * @param reserva the reserva to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated reserva,
     * or with status 400 (Bad Request) if the reserva is not valid,
     * or with status 500 (Internal Server Error) if the reserva couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/reservas")
    @Timed
    public ResponseEntity<Reserva> updateReserva(@Valid @RequestBody Reserva reserva) throws URISyntaxException {
        log.debug("REST request to update Reserva : {}", reserva);
        if (reserva.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Reserva result = reservaRepository.save(reserva);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, reserva.getId().toString()))
            .body(result);
    }

    /**
     * GET  /reservas : get all the reservas.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of reservas in body
     */
    @GetMapping("/reservas")
    @Timed
    public List<Reserva> getAllReservas() {
        log.debug("REST request to get all Reservas");
        return reservaRepository.findAll();
    }

    /**
     * GET  /reservas/compra/{compraId} : get reservas by compraId.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of reservas in body
     */
    @GetMapping("/reservas/compra/{compraId}")
    @Timed
    public List<Reserva> getReservasByCompraId(@PathVariable Long compraId) {
        log.debug("REST request to get Reservas by compraID");
        return reservaRepository.getReservasByCompraId(compraId);
    }

    /**
     * GET  /reservas/:id : get the "id" reserva.
     *
     * @param id the id of the reserva to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the reserva, or with status 404 (Not Found)
     */
    @GetMapping("/reservas/{id}")
    @Timed
    public ResponseEntity<Reserva> getReserva(@PathVariable Long id) {
        log.debug("REST request to get Reserva : {}", id);
        Optional<Reserva> reserva = reservaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(reserva);
    }

    /**
     * DELETE  /reservas/:id : delete the "id" reserva.
     *
     * @param id the id of the reserva to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/reservas/{id}")
    @Timed
    public ResponseEntity<Void> deleteReserva(@PathVariable Long id) {
        log.debug("REST request to delete Reserva : {}", id);

        reservaRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
