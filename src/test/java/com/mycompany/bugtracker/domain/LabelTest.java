package com.mycompany.bugtracker.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.bugtracker.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LabelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Label.class);
        Label label1 = new Label();
        label1.setId("id1");
        Label label2 = new Label();
        label2.setId(label1.getId());
        assertThat(label1).isEqualTo(label2);
        label2.setId("id2");
        assertThat(label1).isNotEqualTo(label2);
        label1.setId(null);
        assertThat(label1).isNotEqualTo(label2);
    }
}
