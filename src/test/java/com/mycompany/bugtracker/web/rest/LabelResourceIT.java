package com.mycompany.bugtracker.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.mycompany.bugtracker.IntegrationTest;
import com.mycompany.bugtracker.domain.Label;
import com.mycompany.bugtracker.repository.LabelRepository;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link LabelResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class LabelResourceIT {

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/labels";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private LabelRepository labelRepository;

    @Autowired
    private WebTestClient webTestClient;

    private Label label;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Label createEntity() {
        Label label = new Label().value(DEFAULT_VALUE);
        return label;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Label createUpdatedEntity() {
        Label label = new Label().value(UPDATED_VALUE);
        return label;
    }

    @BeforeEach
    public void initTest() {
        labelRepository.deleteAll().block();
        label = createEntity();
    }

    @Test
    void createLabel() throws Exception {
        int databaseSizeBeforeCreate = labelRepository.findAll().collectList().block().size();
        // Create the Label
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(label))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Label in the database
        List<Label> labelList = labelRepository.findAll().collectList().block();
        assertThat(labelList).hasSize(databaseSizeBeforeCreate + 1);
        Label testLabel = labelList.get(labelList.size() - 1);
        assertThat(testLabel.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    void createLabelWithExistingId() throws Exception {
        // Create the Label with an existing ID
        label.setId("existing_id");

        int databaseSizeBeforeCreate = labelRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(label))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Label in the database
        List<Label> labelList = labelRepository.findAll().collectList().block();
        assertThat(labelList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllLabelsAsStream() {
        // Initialize the database
        labelRepository.save(label).block();

        List<Label> labelList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Label.class)
            .getResponseBody()
            .filter(label::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(labelList).isNotNull();
        assertThat(labelList).hasSize(1);
        Label testLabel = labelList.get(0);
        assertThat(testLabel.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    void getAllLabels() {
        // Initialize the database
        labelRepository.save(label).block();

        // Get all the labelList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(label.getId()))
            .jsonPath("$.[*].value")
            .value(hasItem(DEFAULT_VALUE));
    }

    @Test
    void getLabel() {
        // Initialize the database
        labelRepository.save(label).block();

        // Get the label
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, label.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(label.getId()))
            .jsonPath("$.value")
            .value(is(DEFAULT_VALUE));
    }

    @Test
    void getNonExistingLabel() {
        // Get the label
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewLabel() throws Exception {
        // Initialize the database
        labelRepository.save(label).block();

        int databaseSizeBeforeUpdate = labelRepository.findAll().collectList().block().size();

        // Update the label
        Label updatedLabel = labelRepository.findById(label.getId()).block();
        updatedLabel.value(UPDATED_VALUE);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedLabel.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedLabel))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Label in the database
        List<Label> labelList = labelRepository.findAll().collectList().block();
        assertThat(labelList).hasSize(databaseSizeBeforeUpdate);
        Label testLabel = labelList.get(labelList.size() - 1);
        assertThat(testLabel.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    void putNonExistingLabel() throws Exception {
        int databaseSizeBeforeUpdate = labelRepository.findAll().collectList().block().size();
        label.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, label.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(label))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Label in the database
        List<Label> labelList = labelRepository.findAll().collectList().block();
        assertThat(labelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchLabel() throws Exception {
        int databaseSizeBeforeUpdate = labelRepository.findAll().collectList().block().size();
        label.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(label))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Label in the database
        List<Label> labelList = labelRepository.findAll().collectList().block();
        assertThat(labelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamLabel() throws Exception {
        int databaseSizeBeforeUpdate = labelRepository.findAll().collectList().block().size();
        label.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(label))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Label in the database
        List<Label> labelList = labelRepository.findAll().collectList().block();
        assertThat(labelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateLabelWithPatch() throws Exception {
        // Initialize the database
        labelRepository.save(label).block();

        int databaseSizeBeforeUpdate = labelRepository.findAll().collectList().block().size();

        // Update the label using partial update
        Label partialUpdatedLabel = new Label();
        partialUpdatedLabel.setId(label.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedLabel.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedLabel))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Label in the database
        List<Label> labelList = labelRepository.findAll().collectList().block();
        assertThat(labelList).hasSize(databaseSizeBeforeUpdate);
        Label testLabel = labelList.get(labelList.size() - 1);
        assertThat(testLabel.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    void fullUpdateLabelWithPatch() throws Exception {
        // Initialize the database
        labelRepository.save(label).block();

        int databaseSizeBeforeUpdate = labelRepository.findAll().collectList().block().size();

        // Update the label using partial update
        Label partialUpdatedLabel = new Label();
        partialUpdatedLabel.setId(label.getId());

        partialUpdatedLabel.value(UPDATED_VALUE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedLabel.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedLabel))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Label in the database
        List<Label> labelList = labelRepository.findAll().collectList().block();
        assertThat(labelList).hasSize(databaseSizeBeforeUpdate);
        Label testLabel = labelList.get(labelList.size() - 1);
        assertThat(testLabel.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    void patchNonExistingLabel() throws Exception {
        int databaseSizeBeforeUpdate = labelRepository.findAll().collectList().block().size();
        label.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, label.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(label))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Label in the database
        List<Label> labelList = labelRepository.findAll().collectList().block();
        assertThat(labelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchLabel() throws Exception {
        int databaseSizeBeforeUpdate = labelRepository.findAll().collectList().block().size();
        label.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(label))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Label in the database
        List<Label> labelList = labelRepository.findAll().collectList().block();
        assertThat(labelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamLabel() throws Exception {
        int databaseSizeBeforeUpdate = labelRepository.findAll().collectList().block().size();
        label.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(label))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Label in the database
        List<Label> labelList = labelRepository.findAll().collectList().block();
        assertThat(labelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteLabel() {
        // Initialize the database
        labelRepository.save(label).block();

        int databaseSizeBeforeDelete = labelRepository.findAll().collectList().block().size();

        // Delete the label
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, label.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Label> labelList = labelRepository.findAll().collectList().block();
        assertThat(labelList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
